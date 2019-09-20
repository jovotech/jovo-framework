import * as fs from 'fs';
import { Config as I18NextConfig, I18Next } from 'jovo-cms-i18next';
import {
	BaseApp,
	ExtensibleConfig,
	Host,
	Log,
	Logger,
	LogLevel,
    Middleware
} from 'jovo-core';
import { FileDb2 } from 'jovo-db-filedb';

import _cloneDeep = require('lodash.clonedeep');
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import * as path from 'path';
import {
	Config as JovoUserConfig,
	ContextConfig,
	JovoUser,
	MetaDataConfig
} from './middleware/user/JovoUser';

import { ComponentConfig } from './middleware/Component';
import { ComponentPlugin } from './middleware/ComponentPlugin';
import { Handler } from './middleware/Handler';
import { BasicLogging } from './middleware/logging/BasicLogging';
import { Config as RouterConfig, Router } from './middleware/Router';

if (process.argv.includes('--port')) {
	process.env.JOVO_PORT = process.argv[
		process.argv.indexOf('--port') + 1
	].trim();
}

if (process.argv.includes('--log-level')) {
	process.env.JOVO_LOG_LEVEL =
		Logger.getLogLevelFromString(
			process.argv[process.argv.indexOf('--log-level') + 1].trim()
		) + '';
}

if (process.argv.includes('--cwd')) {
	process.env.JOVO_CWD = process.argv[process.argv.indexOf('--cwd') + 1].trim();
}

if (process.argv.includes('--config')) {
	process.env.JOVO_CONFIG = process.argv[
		process.argv.indexOf('--config') + 1
	].trim();
}

if (process.argv.includes('--stage')) {
	process.env.JOVO_STAGE = process.argv[
		process.argv.indexOf('--stage') + 1
	].trim();
}

if (process.env.JOVO_PERFORMANCE_REPORT || process.argv.includes('--performance-report')) {

    const middlewareMap: Record<string, string[]> = {};

    function getInstallLocation(stackStr: string, parent: string, middleware: string) {
        const stackArray = stackStr.split('\n');
        for (let i = 0; i < stackArray.length; i++) {
            const stackLine = stackArray[i];
            if (stackLine.includes('Middleware.use')) {
                const nextStackLine = stackArray[i + 1];
                let pluginName = 'Object.<anonymous>';

                if (!nextStackLine.includes(pluginName)) {
                    pluginName = nextStackLine.substring(nextStackLine.indexOf('at') + 3, nextStackLine.indexOf('.install'));
                }
                let location = ' - ' + nextStackLine.substring(nextStackLine.indexOf('(') + 1, nextStackLine.indexOf(')'));
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
    BaseApp.prototype.handle = async function (host) {
        Log.info();
        Log.infoStart('Handle duration ')
        await oldBaseAppHandle.call(this, host);
        Log.infoEnd('Handle duration ')
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

        if (duration <= 80) { // good value
            Log.green().info(`+${duration.toFixed(0)}ms`);
        } else if (duration > 80 && duration <= 200) {  // ok value
            Log.yellow().info(`+${duration.toFixed(0)}ms`);
        } else if (duration > 200) {  // bad value
            Log.red().info(`+${duration.toFixed(0)}ms`);
        }

        const middlewareFullKey = `${this.parent.constructor.name}.${this.name}`;


        if (middlewareMap[middlewareFullKey]) {
            middlewareMap[middlewareFullKey].forEach((impl) => {
                // Log.dim().info(`↓ ${impl}`);
            })
        }
    };

}



export class App extends BaseApp {
	config: Config = {
		enabled: true,
		inputMap: {},
        intentMap: {},
        plugin: {}
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

		const pathToConfig =
			process.env.JOVO_CONFIG || path.join(process.cwd(), 'config.js');
		if (fs.existsSync(pathToConfig)) {
			const fileConfig = require(pathToConfig) || {};
			this.config = _merge(fileConfig, this.config);
			Log.verbose('Using ' + pathToConfig);
		} else {
			if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'UNIT_TEST') {
				Log.warn(`WARN: Couldn't find default config.js in your project.`);
				Log.warn(`WARN: Expected path: ${path.resolve(pathToConfig)}`);
			}
		}

		const stage =
			process.env.JOVO_STAGE || process.env.STAGE || process.env.NODE_ENV;

		if (stage) {
			Log.verbose('Stage: ' + stage);
		}

		if (Logger.isLogLevel(LogLevel.VERBOSE)) {
			const pathToPackageJsonInSrc = path.join(
				process.cwd(),
				'package-lock.json'
			);
			const pathToPackageJsonInProject = path.join(
				process.cwd(),
				'..',
				'package-lock.json'
			);
			let pathToPackageLockJson: string;
			if (fs.existsSync(pathToPackageJsonInSrc)) {
				pathToPackageLockJson = pathToPackageJsonInSrc;
			}
			if (fs.existsSync(pathToPackageJsonInProject)) {
				pathToPackageLockJson = pathToPackageJsonInProject;
			}

			try {
				const packageLockJson: any = require(pathToPackageLockJson!); // tslint:disable-line

				const dependencies = Object.keys(packageLockJson.dependencies).filter(
					val => val.startsWith('jovo-')
				);
				Log.verbose(
					Log.header(
						'Jovo dependencies from package-lock.json',
						'jovo-framework'
					)
				);
				dependencies.forEach((jovoDependency: string) => {
					Log.yellow().verbose(
						` ${jovoDependency}@${
							packageLockJson.dependencies[jovoDependency].version
						}`
					);
				});
			} catch (e) {
			    //
            }
		}

		const pathToStageConfig = path.join(
			process.cwd(),
			'config.' + stage + '.js'
		);

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
		this.v1ConfigMigration();
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
					logging: this.config.logging
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
						enabled: this.config.user.metaData
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
						enabled: this.config.user.context
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

	v1ConfigMigration() {
		if (this.config.v1) {
			_set(
				this.config,
				'plugin.JovoUser.implicitSave',
				_get(this.config, 'plugin.JovoUser.implicitSave') ||
					_get(this.config, 'v1.saveUserOnResponseEnabled')
			);
			_set(
				this.config,
				'plugin.JovoUser.columnName',
				_get(this.config, 'plugin.JovoUser.columnName') ||
					_get(this.config, 'v1.userDataCol')
			);
			_set(
				this.config,
				'inputMap',
				this.config.inputMap || _get(this.config, 'v1.inputMap')
			);
			_set(
				this.config,
				'plugin.Router.intentsToSkipUnhandled',
				_get(this.config, 'plugin.Router.intentsToSkipUnhandled') ||
					_get(this.config, 'v1.intentsToSkipUnhandled')
			);
			_set(
				this.config,
				'plugin.Router.intentMap',
				this.config.intentMap || _get(this.config, 'v1.intentMap')
			);

			if (_get(this.config, 'v1.saveBeforeResponseEnabled')) {
				Log.info(`'saveBeforeResponseEnabled' is deprecated since 2.0 `);
			}
			if (_get(this.config, 'v1.db.type') === 'file') {
				_set(
					this.config,
					'plugin.FileDb.pathToFile',
					_get(this.config, 'plugin.FileDb.pathToFile') ||
						`./db/${_get(this.config, 'v1.db.localDbFilename')}.json`
				);
			}

			if (_get(this.config, 'v1.db.type') === 'dynamodb') {
				_set(
					this.config,
					'plugin.DynamoDb.tableName',
					_get(this.config, 'plugin.DynamoDb.tableName') ||
						_get(this.config, 'v1.db.tableName')
				);
				_set(
					this.config,
					'plugin.DynamoDb.awsConfig',
					_get(this.config, 'plugin.DynamoDb.awsConfig') ||
						_get(this.config, 'v1.db.awsConfig')
				);
			}

			_set(
				this.config,
				'plugin.JovoUser.metaData',
				_get(this.config, 'plugin.JovoUser.metaData') ||
					_get(this.config, 'v1.userMetaData')
			);
			_set(
				this.config,
				'plugin.JovoUser.context',
				_get(this.config, 'plugin.JovoUser.context') ||
					_get(this.config, 'v1.userContext')
			);
			_set(
				this.config,
				'plugin.I18Next',
				_get(this.config, 'plugin.I18Next') || _get(this.config, 'v1.i18n')
			);
			_set(
				this.config,
				'plugin.Alexa',
				_get(this.config, 'plugin.Alexa') || _get(this.config, 'v1.alexaSkill')
			);
			_set(
				this.config,
				'plugin.GoogleAssistant',
				_get(this.config, 'plugin.GoogleAssistant') ||
					_get(this.config, 'v1.googleAction')
			);
		}
	}

	init() {
		this.use(new BasicLogging());
		this.use(new JovoUser());
		this.use(new I18Next());
		this.use(new Router());
		this.use(new Handler());
	}

	async handle(host: Host) {
		if (host.headers && host.headers['jovo-test']) {
			let fileDb2Path = './../db/tests';

			if (this.$db && this.$db.config && (this.$db.config! as any).pathToFile) {
				// tslint:disable-line
				const dbPath = path.parse((this.$db.config! as any).pathToFile); // tslint:disable-line
				fileDb2Path = dbPath.dir + '/tests';
			}

			if (host.headers['jovo-test'] === 'TestHost') {
				fileDb2Path = './db/tests';
			}
			this.use(
				new FileDb2({
					path: fileDb2Path
				})
			);
		}
		await super.handle(host);
	}

	/**
	 * 
	 * @param {ComponentPlugin[]} components 
	 */
	useComponents(...components: ComponentPlugin[]) {
		/**
		 * router needs to access $components object,
		 * which gets initialized in `initializeComponents`
		 */
		this.middleware('before.router')!.use(ComponentPlugin.initializeComponents);
		this.middleware('platform.output')!.use(ComponentPlugin.saveComponentSessionData);

		components.forEach((componentPlugin) => {
			this.middleware('setup')!.use(componentPlugin.setAsBaseComponent.bind(componentPlugin));

			componentPlugin.name = componentPlugin.name || componentPlugin.constructor.name;

			if (this.$config.components) {
				const componentAppConfig: ComponentConfig = _cloneDeep(
					this.$config.components[componentPlugin.name!]
				); // config defined in project's main config.js file
				_merge(componentPlugin.config, componentAppConfig);
			}

			componentPlugin.install(this);
			/**
			 * 1st layer components handler have to be set after the child component's handler were merged
			 * currently they are merged in `after.setup`
			 */
			this.middleware('before.request')!.use(componentPlugin.setHandler.bind(componentPlugin));
			this.$plugins.set(componentPlugin.name!, componentPlugin);

			this.emit('use', componentPlugin);

			if (this.constructor.name === 'App') {
				Log.yellow().verbose(`Installed component: ${componentPlugin.name}`);
				Log.debug(`${JSON.stringify(componentPlugin.config || {}, null, '\t')}`);
				Log.debug();
			}
		});
	}

	/**
	 * @deprecated
	 * @param config
	 */
	setConfig(config: Config) {
		this.config = _merge(this.config, config);
		this.mergePluginConfiguration();
		this.initConfig();
		this.v1ConfigMigration();
		this.init();
	}

	/**
	 * @deprecated
	 * @param {boolean} val
	 */
	enableLogging(val = true) {
		this.config.logging = val;
		if (this.$plugins.get('BasicLogging')) {
			(this.$plugins.get('BasicLogging') as BasicLogging).config.logging = val;
			_set(this.config, 'plugin.BasicLogging.logging', val);
		}
		this.enableRequestLogging(val);
		this.enableResponseLogging(val);
	}

	/**
	 * @deprecated
	 * @param {boolean} val
	 */
	enableRequestLogging(val = true) {
		if (this.$plugins.get('BasicLogging')) {
			(this.$plugins.get('BasicLogging') as BasicLogging).config.request = val;
			_set(this.config, 'plugin.BasicLogging.requestLogging', val);
		}
		// this.config.request = val;
	}

	/**
	 * @deprecated
	 * @param {boolean} val
	 */
	enableResponseLogging(val = true) {
		if (this.$plugins.get('BasicLogging')) {
			(this.$plugins.get('BasicLogging') as BasicLogging).config.response = val;
			_set(this.config, 'plugin.BasicLogging.responseLogging', val);
		}
		// this.config.responseLogging = val;
	}

	/**
	 * @deprecated
	 * @param {string | string[]} path
	 */
	setRequestLoggingObjects(pathToObject: string | string[]) {
		if (typeof pathToObject === 'string') {
			// this.config.requestLoggingObjects = [path];
		} else {
			// this.config.requestLoggingObjects = path;
		}

		if (this.$plugins.get('BasicLogging')) {
			// (this.$plugins.get('BasicLogging') as BasicLogging).config.requestLoggingObjects = this.config.requestLoggingObjects;
			// _set(this.config, 'plugin.BasicLogging.logging', this.config.requestLoggingObjects);
		}
	}

	/**
	 * @deprecated
	 * @param {string | string[]} path
	 */
	setResponseLoggingObjects(pathToObject: string | string[]) {
		if (typeof pathToObject === 'string') {
			// this.config.responseLoggingObjects = [path];
		} else {
			// this.config.responseLoggingObjects = path;
		}

		if (this.$plugins.get('BasicLogging')) {
			// (this.$plugins.get('BasicLogging') as BasicLogging).config.responseLoggingObjects = this.config.responseLoggingObjects;
			// _set(this.config, 'plugin.BasicLogging.logging', this.config.responseLoggingObjects);
		}
	}

	/**
	 * @deprecated
	 * @param {{[p: string]: string}} inputMap
	 */
	setInputMap(inputMap: { [key: string]: string }) {
		this.config.inputMap = inputMap;
	}

	/**
	 * @deprecated
	 * @param {UserMetaDataConfig} userMetaData
	 */
	setUserMetaData(userMetaData: MetaDataConfig) {
		if (!this.config.user) {
			this.config.user = {};
		}
		this.config.user.metaData = userMetaData;
	}

	/**
	 * @deprecated
	 * @param {UserContextConfig} userContext
	 */
	setUserContext(userContext: ContextConfig) {
		if (!this.config.user) {
			this.config.user = {};
		}
		this.config.user.context = userContext;
	}

	/**
	 * @deprecated
	 * @param {{[p: string]: string}} intentMap
	 */
	setIntentMap(intentMap: { [key: string]: string }) {
		this.config.intentMap = intentMap;
		if (this.$plugins.get('Router')) {
			(this.$plugins.get(
				'Router'
			) as Router).config.intentMap = this.config.intentMap;
			_set(this.config, 'plugin.Router.intentMap', this.config.intentMap);
		}
	}

	/**
	 * @deprecated
	 * @param {string[]} intentsToSkipUnhandled
	 */
	setIntentsToSkipUnhandled(intentsToSkipUnhandled: string[]) {
		if (this.$plugins.get('Router')) {
			(this.$plugins.get(
				'Router'
			) as Router).config.intentsToSkipUnhandled = intentsToSkipUnhandled;
			_set(
				this.config,
				'plugin.Router.intentsToSkipUnhandled',
				intentsToSkipUnhandled
			);
		}
	}

	/**
	 * @deprecated
	 * @param i18n
	 */
	setI18n(i18n: any) {
		// tslint:disable-line
		if (this.$plugins.get('I18Next')) {
			(this.$plugins.get('I18Next') as I18Next).config = i18n;
			_set(this.config, 'plugin.I18Next', i18n);
		}
	}

	/**
	 * @deprecated
	 * @param alexaSkillConfig
	 */
	setAlexaSkill(alexaSkillConfig: any) {
		// tslint:disable-line
		if (this.$plugins.get('Alexa')) {
			_set(this.$plugins.get('Alexa')!, 'config', alexaSkillConfig);
		}
	}

	/**
	 * @deprecated
	 * @param googleActionConfig
	 */
	setGoogleAction(googleActionConfig: any) {
		// tslint:disable-line
		if (this.$plugins.get('GoogleAssistant')) {
			_set(this.$plugins.get('GoogleAssistant')!, 'config', googleActionConfig);
		}
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	setDb(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	setDynamoDb(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	setDynamoDbKey(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	setLanguageResources(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	setAnalytics(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addAnalytics(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addDashbotGoogleAction(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addDashbotAlexa(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addBotanalyticsGoogleAction(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addBotanalyticsAlexa(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addBespokenAnalytics(dbConfig: any) {
		// tslint:disable-line
	}

	/**
	 * @deprecated
	 * @param dbConfig
	 */
	addChatbaseAnalytics(dbConfig: any) {
		// tslint:disable-line
	}
}

export interface LoggingConfig {
	request?: boolean;
	response?: boolean;
	requestObjects?: string[];
	responseObjects?: string[];
}

export interface Config extends ExtensibleConfig {
	v1?: {
		logging?: boolean;
		requestLogging?: boolean;
		responseLogging?: boolean;
		requestLoggingObjects?: string[];
		responseLoggingObjects?: string[];

		intentMap?: { [key: string]: string };
		inputMap?: { [key: string]: string };

		intentsToSkipUnhandled: string[];
		userMetaData?: MetaDataConfig;
		userContext?: ContextConfig;
		i18n: any; // tslint:disable-line
	};
	keepSessionDataOnSessionEnded?: boolean;
	logging?: boolean | LoggingConfig;

	inputMap?: { [key: string]: string };

	user?:
		| JovoUserConfig
		| { [key: string]: any; metaData: boolean; context: boolean }; // tslint:disable-line
	i18n?: I18NextConfig;
	db?: { [key: string]: any }; // tslint:disable-line
	analytics?: { [key: string]: any }; // tslint:disable-line
	platform?: { [key: string]: any }; // tslint:disable-line
	cms?: { [key: string]: any }; // tslint:disable-line
	nlu?: { [key: string]: any }; // tslint:disable-line
	components?: { [key: string]: ComponentConfig }; // tslint:disable-line
}

// handler
export interface Config {
	handlers?: any; // tslint:disable-line
}

export interface Config extends RouterConfig {}
