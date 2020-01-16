import * as fs from 'fs';
import * as path from 'path';

import {
  AppAnalyticsConfig,
  AppCmsConfig,
  AppComponentsConfig,
  AppDbConfig,
  AppNluConfig,
  AppPlatformConfig,
  BaseApp,
  ExtensibleConfig,
  Handler,
  Host,
  I18NextConfig,
  Log,
  Logger,
  LogLevel,
  Middleware,
} from 'jovo-core';
import { FileDb2 } from 'jovo-db-filedb';
import _merge = require('lodash.merge');
import { BasicLogging, Config as LoggingConfig } from './middleware/logging/BasicLogging';
import { Config as JovoUserConfig, JovoUser } from './middleware/user/JovoUser';

if (process.argv.includes('--port')) {
  process.env.JOVO_PORT = process.argv[process.argv.indexOf('--port') + 1].trim();
}

if (process.argv.includes('--log-level')) {
  process.env.JOVO_LOG_LEVEL =
    Logger.getLogLevelFromString(process.argv[process.argv.indexOf('--log-level') + 1].trim()) + '';
}

if (process.argv.includes('--cwd')) {
  process.env.JOVO_CWD = process.argv[process.argv.indexOf('--cwd') + 1].trim();
}

if (process.argv.includes('--config')) {
  process.env.JOVO_CONFIG = process.argv[process.argv.indexOf('--config') + 1].trim();
}

if (process.argv.includes('--stage')) {
  process.env.JOVO_STAGE = process.argv[process.argv.indexOf('--stage') + 1].trim();
}

if (process.env.JOVO_PERFORMANCE_REPORT || process.argv.includes('--performance-report')) {
  const middlewareMap: Record<string, string[]> = {};
  const performanceReport = process.argv[process.argv.indexOf('--performance-report') + 1]
    ? process.argv[process.argv.indexOf('--performance-report') + 1].trim()
    : undefined;

  function getInstallLocation(stackStr: string, parent: string, middleware: string) {
    const stackArray = stackStr.split('\n');
    for (let i = 0; i < stackArray.length; i++) {
      const stackLine = stackArray[i];
      if (stackLine.includes('Middleware.use')) {
        const nextStackLine = stackArray[i + 1];
        let pluginName = 'Object.<anonymous>';

        if (!nextStackLine.includes(pluginName)) {
          pluginName = nextStackLine.substring(
            nextStackLine.indexOf('at') + 3,
            nextStackLine.indexOf('.install'),
          );
        }
        let location =
          ' - ' +
          nextStackLine.substring(nextStackLine.indexOf('(') + 1, nextStackLine.indexOf(')'));
        // location = location.substring(process.cwd().length - 3);
        location = '';
        const middlewareFullKey = `${parent}.${middleware}`;

        if (!middlewareMap[middlewareFullKey]) {
          middlewareMap[middlewareFullKey] = [];
        }

        middlewareMap[middlewareFullKey].push(`${pluginName}${location}`);
      }
    }
  }

  const oldMiddlewareUse = Middleware.prototype.use;

  Middleware.prototype.use = function(fns) {
    getInstallLocation(new Error().stack!, this.parent.constructor.name, this.name);
    oldMiddlewareUse.call(this, fns);
    return this;
  };

  const oldBaseAppHandle = BaseApp.prototype.handle;
  BaseApp.prototype.handle = async function(host) {
    Log.info();
    Log.infoStart('Handle duration ');
    await oldBaseAppHandle.call(this, host);
    Log.infoEnd('Handle duration ');
  };

  const oldMiddlewareRun = Middleware.prototype.run;

  Middleware.prototype.run = async function(object, concurrent) {
    const start = process.hrtime();
    await oldMiddlewareRun.call(this, object, concurrent);
    const end = process.hrtime();

    // duration of the complete middleware process
    let duration = (end[1] - start[1]) / 1000 / 1000; // from nano to ms

    if (duration < 0) {
      duration = 0;
    }

    Log.writeToStreams(`\b→ ${this.parent.constructor.name}.${this.name}`, 2, false);

    if (duration <= 80) {
      // good value
      Log.green().info(`+${duration.toFixed(0)}ms`);
    } else if (duration > 80 && duration <= 200) {
      // ok value
      Log.yellow().info(`+${duration.toFixed(0)}ms`);
    } else if (duration > 200) {
      // bad value
      Log.red().info(`+${duration.toFixed(0)}ms`);
    }

    const middlewareFullKey = `${this.parent.constructor.name}.${this.name}`;

    if (middlewareMap[middlewareFullKey]) {
      middlewareMap[middlewareFullKey].forEach((impl) => {
        if (performanceReport === 'detailed') {
          Log.dim().info(`↓ ${impl}`);
        }
      });
    }
  };
}

export class App extends BaseApp {
  config: Config = {
    enabled: true,
    inputMap: {},
    intentMap: {},
    plugin: {},
  };

  $config: Config;

  constructor(config?: Config) {
    super(config);
    this.$cms = {};

    if (config) {
      this.config = _merge(this.config, config);
    }

    Log.verbose();
    Log.verbose(Log.header(`Verbose information ${new Date().toISOString()}`));

    // sets specific cwd
    if (process.env.JOVO_CWD) {
      process.chdir(process.env.JOVO_CWD);
    }

    const pathToConfig = process.env.JOVO_CONFIG || path.join(process.cwd(), 'config.js');
    if (fs.existsSync(pathToConfig)) {
      const fileConfig = require(pathToConfig) || {};
      this.config = _merge(fileConfig, this.config);
      Log.verbose('Using ' + pathToConfig);
    } else {
      if (!config && (!process.env.NODE_ENV || process.env.NODE_ENV !== 'UNIT_TEST')) {
        Log.warn(`WARN: Couldn't find default config.js in your project.`);
        Log.warn(`WARN: Expected path: ${path.resolve(pathToConfig)}`);
      }
    }

    const stage = process.env.JOVO_STAGE || process.env.STAGE || process.env.NODE_ENV;

    if (stage) {
      Log.verbose('Stage: ' + stage);
    }

    if (Logger.isLogLevel(LogLevel.VERBOSE)) {
      const pathToPackageJsonInSrc = path.join(process.cwd(), 'package-lock.json');
      const pathToPackageJsonInProject = path.join(process.cwd(), '..', 'package-lock.json');
      let pathToPackageLockJson: string;
      if (fs.existsSync(pathToPackageJsonInSrc)) {
        pathToPackageLockJson = pathToPackageJsonInSrc;
      }
      if (fs.existsSync(pathToPackageJsonInProject)) {
        pathToPackageLockJson = pathToPackageJsonInProject;
      }

      try {
        const packageLockJson: any = require(pathToPackageLockJson!); // tslint:disable-line

        const dependencies = Object.keys(packageLockJson.dependencies).filter((val) =>
          val.startsWith('jovo-'),
        );
        Log.verbose(Log.header('Jovo dependencies from package-lock.json', 'jovo-framework'));
        dependencies.forEach((jovoDependency: string) => {
          Log.yellow().verbose(
            ` ${jovoDependency}@${packageLockJson.dependencies[jovoDependency].version}`,
          );
        });
      } catch (e) {
        //
      }
    }

    const pathToStageConfig = path.join(process.cwd(), 'config.' + stage + '.js');

    if (fs.existsSync(pathToStageConfig)) {
      const fileStageConfig = require(pathToStageConfig) || {};
      _merge(this.config, fileStageConfig);
      Log.verbose(`Merging stage specific config.js for stage ${stage} `);
    } else {
      if (stage) {
        Log.verbose(`No config file for stage ${stage}. `);
      }
    }

    this.mergePluginConfiguration();
    this.initConfig();

    Log.verbose(Log.header('App object initialized', 'jovo-framework'));
    this.$config = this.config;
    this.init();
  }

  mergePluginConfiguration() {
    _merge(this.config.plugin, this.config.platform);
    _merge(this.config.plugin, this.config.db);
    _merge(this.config.plugin, this.config.cms);
    _merge(this.config.plugin, this.config.analytics);
    _merge(this.config.plugin, this.config.nlu);
    _merge(this.config.plugin, this.config.components);
  }

  initConfig() {
    if (!this.config.plugin) {
      this.config.plugin = {};
    }

    // logging
    if (typeof this.config.logging !== 'undefined') {
      if (typeof this.config.logging === 'boolean') {
        this.config.plugin.BasicLogging = {
          logging: this.config.logging,
        };
      } else {
        this.config.plugin.BasicLogging = this.config.logging;
      }
    }

    // user
    if (typeof this.config.user !== 'undefined') {
      this.config.plugin.JovoUser = this.config.user;
      if (this.config.user.metaData) {
        if (typeof this.config.user.metaData === 'boolean') {
          if (!this.config.plugin.JovoUser.metaData) {
            this.config.plugin.JovoUser.metaData = {};
          }
          this.config.plugin.JovoUser.metaData = {
            enabled: this.config.user.metaData,
          };
        } else {
          this.config.plugin.JovoUser.metaData = this.config.user.metaData;
        }
      }

      if (this.config.user.context) {
        if (typeof this.config.user.context === 'boolean') {
          if (!this.config.plugin.JovoUser.context) {
            this.config.plugin.JovoUser.context = {};
          }
          this.config.plugin.JovoUser.context = {
            enabled: this.config.user.context,
          };
        } else {
          this.config.plugin.JovoUser.context = this.config.user.context;
        }
      }
    }

    // inputMap

    // router (intentMap)
    if (this.config.intentMap) {
      if (!this.config.plugin.Router) {
        this.config.plugin.Router = {};
      }
      this.config.plugin.Router.intentMap = this.config.intentMap;
    }
    // router (intentsToSkipUnhandled)
    if (this.config.intentsToSkipUnhandled) {
      if (!this.config.plugin.Router) {
        this.config.plugin.Router = {};
      }
      this.config.plugin.Router.intentsToSkipUnhandled = this.config.intentsToSkipUnhandled;
    }

    // i18next
    if (this.config.i18n) {
      this.config.plugin.I18Next = this.config.i18n;
    }
  }

  init() {
    this.use(new BasicLogging());
    this.use(new JovoUser());
  }

  async handle(host: Host) {
    if (host.headers && host.headers['jovo-test']) {
      let fileDb2Path = './../db/tests';

      // tslint:disable-next-line
      if (this.$db && this.$db.config && (this.$db.config! as any).pathToFile) {
        const dbPath = path.parse((this.$db.config! as any).pathToFile); // tslint:disable-line
        fileDb2Path = dbPath.dir + '/tests';
      }

      if (host.headers['jovo-test'] === 'TestHost') {
        fileDb2Path = './db/tests';
      }
      this.use(
        new FileDb2({
          path: fileDb2Path,
        }),
      );
    }
    await super.handle(host);
  }

  /**
   * @deprecated
   * @param config
   */
  setConfig(config: Config) {
    this.config = _merge(this.config, config);

    this.mergePluginConfiguration();
    this.initConfig();
    this.init();
  }
}

export interface Config extends ExtensibleConfig {
  keepSessionDataOnSessionEnded?: boolean;
  logging?: boolean | LoggingConfig;

  inputMap?: { [key: string]: string };

  user?: JovoUserConfig | { [key: string]: any; metaData: boolean; context: boolean }; // tslint:disable-line
  i18n?: I18NextConfig;

  db?: AppDbConfig;
  analytics?: AppAnalyticsConfig;
  platform?: AppPlatformConfig;
  cms?: AppCmsConfig;
  nlu?: AppNluConfig;
  // components?: AppComponentsConfig;

  handlers?: Handler[];
}
