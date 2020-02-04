import _cloneDeep = require('lodash.clonedeep');
import _merge = require('lodash.merge');
import { JovoError } from '../errors/JovoError';
import { Project } from '../index';
import { AppData, Db, Host } from '../Interfaces';
import { ComponentConfig } from '../plugins/Component';
import { ComponentPlugin } from '../plugins/ComponentPlugin';
import { Handler } from '../plugins/Handler';
import { I18Next } from '../plugins/I18Next';
import { Router } from '../plugins/Router';
import { Log, LogLevel } from '../util/Log';
import { ActionSet } from './ActionSet';
import { Extensible, ExtensibleConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { Platform } from './Platform';

process.on('unhandledRejection', (reason, p) => {
  Log.error('unhandledRejection');
  Log.error(p);
  if (reason) {
    if ((reason as any).stack) {
      Log.error((reason as any).stack);
    }
    Log.error(reason);
  }
});

process.on('uncaughtException', (err) => {
  if ((err as JovoError).code && (err as JovoError).code === 'EADDRINUSE') {
    const usedPort = err.message.replace(/^\D+/g, '');
    err.message = `The port ${usedPort} is already in use.`;
    (err as JovoError).hint =
      'You might already run Jovo in a different tab. ' +
      'If the port is used by a different application, you can either change the port number in src/index.js, or specify the port as an option,' +
      ' e.g. jovo run --port 3301';
  }

  JovoError.printError(err as JovoError);
});

export type BaseAppMiddleware =
  | 'setup'
  | 'request'
  | 'platform.init'
  | 'asr'
  | 'platform.nlu'
  | 'nlu'
  | 'user.load'
  | 'router'
  | 'handler'
  | 'user.save'
  | 'tts'
  | 'platform.output'
  | 'response'
  | 'fail'
  | string;

export interface BaseAppConfig extends ExtensibleConfig {
  inputMap?: { [key: string]: string };
}

// @ts-ignore
process.env.JOVO_LOG_LEVEL = LogLevel.INFO;

export class BaseApp extends Extensible {
  config: BaseAppConfig = {};

  $platform: Map<string, Platform> = new Map();

  $db!: Db;
  $cms: any = {}; // tslint:disable-line

  $data: AppData = {};

  middlewares: BaseAppMiddleware[] = [
    'setup',
    'request',
    'platform.init',
    'asr',
    'platform.nlu',
    'nlu',
    'user.load',
    'router',
    'handler',
    'user.save',
    'tts',
    'platform.output',
    'response',
    'fail',
  ];
  private initialized = false;

  constructor(config?: BaseAppConfig) {
    super(config);

    this.actionSet = new ActionSet(this.middlewares, this);

    if (process.env.NODE_ENV !== 'UNIT_TEST') {
      process.on('exit', () => {
        this.emit('exit');
      });

      // catch ctrl+c event and exit normally
      process.on('SIGINT', () => {
        process.exit(2);
      });
    }

    this.use(new I18Next());
    this.use(new Router());
    this.use(new Handler());
  }

  /**
   * Initialize setup middleware
   * @param {Function} callback
   */
  setUp(callback: Function) {
    this.middleware('setup')!.use(callback);
  }

  /**
   * Is called on exit
   * IMPORTANT: Must have synchronous code only
   * @param {Function} callback
   */
  tearDown(callback: Function) {
    this.on('exit', (jovo) => {
      callback(jovo);
    });
  }

  /**
   * Returns platform with given name.
   * @param {string} name
   * @returns {Platform | undefined}
   */
  getPlatformByName(name: string): Platform | undefined {
    return this.$platform.get(name);
  }

  /**
   * Returns platform type names
   * Example: ['Alexa', 'GoogleAssistant']
   */
  getPlatformTypes() {
    return [...this.$platform.keys()];
  }

  /**
   * Returns platform app type names
   * Example: ['AlexaSkill', 'GoogleAction']
   */
  getAppTypes() {
    const appTypes: string[] = [];

    this.$platform.forEach((platform: Platform) => {
      appTypes.push(platform.getAppType());
    });

    return appTypes;
  }

  /**
   * Emits webhook.init event.
   */
  initWebhook() {
    this.emit('webhook.init');
  }

  /**
   * Hooks for the middleware handling.
   * @param {BaseAppMiddleware} name
   * @param {Function} func
   */
  hook(name: BaseAppMiddleware, func: Function) {
    if (!this.middleware(name)) {
      throw new JovoError(`Can't find hook with name '${name}'`, 'jovo-core');
    }

    this.middleware(name)!.use(async (handleRequest: HandleRequest) => {
      const params = getParamNames(func);

      // callback parameter is available, wait before it gets called
      if (params.length === 4) {
        await new Promise((resolve) => {
          func.apply(undefined, [
            handleRequest.error,
            handleRequest.host,
            handleRequest.jovo,
            resolve,
          ]);
        });
      } else {
        await func.apply(undefined, [handleRequest.error, handleRequest.host, handleRequest.jovo]);
      }
    });
  }

  /**
   * Main entry method which handles the request.
   * @param {Host} host
   * @returns {Promise<void>}
   */
  async handle(host: Host) {
    const handleRequest: HandleRequest = new HandleRequest(this, host);
    try {
      Log.setRequestContext(host);
      Log.verbose(Log.header('Start request', 'framework'));

      // initialize on first call only
      if (!this.initialized) {
        // First initialization of app object with first incoming request. Is executed once as long as app is alive
        // Useful for api calls that take longer. Results can be saved in the app object for a simple caching.
        await this.middleware('setup')!.run(handleRequest);
        this.initialized = true;
      }

      // Raw JSON request from platform gets processed. Can be used for authentication middlewares.
      await this.middleware('request')!.run(handleRequest);

      // Determines which platform (e.g. Alexa, GoogleAssistant) sent the request. Initialization of abstracted jovo (this) object.
      await this.middleware('platform.init')!.run(handleRequest);

      const shouldBeInitialized =
        !handleRequest.excludedMiddlewareNames ||
        !handleRequest.excludedMiddlewareNames.includes('platform.init');
      if (!handleRequest.jovo && shouldBeInitialized) {
        throw new JovoError(
          `Can't handle request object.`,
          'ERR_NO_MATCHING_PLATFORM',
          'jovo-core',
          undefined,
          'Please add an integration that handles that type of request.',
        );
      } else if (handleRequest.jovo) {
        Log.verbose(Log.header('After init ', 'framework'));

        Log.yellow().verbose(
          `this.\$${handleRequest.jovo.constructor.name
            .substr(0, 1)
            .toLowerCase()}${handleRequest.jovo.constructor.name.substr(1)} initialized`,
        );

        Log.yellow().verbose(`this.$type: ${JSON.stringify(handleRequest.jovo.$type)} `);
        Log.yellow().verbose(
          `this.$session.$data : ${JSON.stringify(handleRequest.jovo.$session.$data)}`,
        );
        Log.verbose();
      }

      // Automatic speech recognition (ASR) information gets extracted.
      await this.middleware('asr')!.run(handleRequest);

      // 	Natural language understanding (NLU) information gets extracted for built-in NLUs (e.g. Alexa). Intents and inputs are set.
      await this.middleware('platform.nlu')!.run(handleRequest);

      // Request gets routed through external NLU (e.g. Dialogflow standalone). Intents and inputs are set.
      await this.middleware('nlu')!.run(handleRequest);

      if (handleRequest.jovo) {
        Log.verbose(Log.header('After nlu ', 'framework'));
        Log.yellow().verbose(`this.$nlu : ${JSON.stringify(handleRequest.jovo.$nlu)}`);
        Log.yellow().verbose(`this.$inputs : ${JSON.stringify(handleRequest.jovo.$inputs)}`);
      }

      // Initialization of user object. User data is retrieved from database.
      await this.middleware('user.load')!.run(handleRequest);

      // Request and NLU data (intent, input, state) is passed to router. intentMap and inputMap are executed. Handler path is generated.
      await this.middleware('router')!.run(handleRequest);

      // Handler logic is executed. Output object is created and finalized.
      await this.middleware('handler')!.run(handleRequest);

      // User gets finalized, DB operations.
      await this.middleware('user.save')!.run(handleRequest);

      if (handleRequest.jovo) {
        Log.white().verbose(Log.header(`Output object: this.$output`, 'framework'));
        Log.yellow().verbose(JSON.stringify(handleRequest.jovo.$output, null, '\t'));
      }

      await this.middleware('tts')!.run(handleRequest);

      // Platform response JSON gets created from output object.
      await this.middleware('platform.output')!.run(handleRequest);

      Log.verbose(Log.header('Response ', 'framework'));
      // Response gets sent back to platform.
      await this.middleware('response')!.run(handleRequest);
    } catch (e) {
      JovoError.printError(e);

      if (handleRequest.jovo) {
        Log.error();
        Log.error('Request details:');
        Log.error(
          `this.\$${handleRequest.jovo.constructor.name
            .substr(0, 1)
            .toLowerCase()}${handleRequest.jovo.constructor.name.substr(1)} initialized`,
        );
        Log.error(`this.$type: ${JSON.stringify(handleRequest.jovo.$type)}`);
        Log.error(`this.$session.$data : ${JSON.stringify(handleRequest.jovo.$session.$data)}`);
        Log.error(`this.$nlu : ${JSON.stringify(handleRequest.jovo.$nlu)}`);
        Log.error(`this.$inputs : ${JSON.stringify(handleRequest.jovo.$inputs)}`);
        Log.error();
      }

      handleRequest.error = e;
      Log.red().error(Log.header());
      await this.middleware('fail')!.run(handleRequest);
      handleRequest.host.fail(e);
    }
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

      if (this.config.components) {
        const componentAppConfig: ComponentConfig = _cloneDeep(
          this.config.components[componentPlugin.name!],
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

  getProject() {
    return Project;
  }

  /**
   * On request listener
   * @param {Function} callback
   */
  onRequest(callback: Function) {
    this.on('request', (handleRequest: HandleRequest) => {
      callback(handleRequest);
    });
  }

  /**
   * On response listener
   * @param {Function} callback
   */
  onResponse(callback: Function) {
    this.on('response', (handleRequest: HandleRequest) => {
      callback(handleRequest);
    });
  }

  /**
   * On error listener. Same as the onFail listener
   * @param {Function} callback
   */
  onError(callback: Function) {
    this.on('fail', (handleRequest: HandleRequest) => {
      callback(handleRequest);
    });
  }

  /**
   * On fail listener
   * @param {Function} callback
   */
  onFail(callback: Function) {
    this.on('fail', (handleRequest: HandleRequest) => {
      callback(handleRequest);
    });
  }

  /**
   * BaseApp install method. Nothing to do here
   * @param extensible
   */
  install(extensible: Extensible) {
    // tslint:disable-line:no-empty
  }

  /**
   * BaseApp uninstall method. Nothing to do here
   * @param extensible
   */
  uninstall(extensible: Extensible) {
    // tslint:disable-line:no-empty
  }
}

/**
 * Helper
 * Returns array of parameter names from a function.
 * @param {Function} func
 * @returns {string[]}
 */
function getParamNames(func: Function): string[] {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) {
    result = [];
  }
  return result;
}
