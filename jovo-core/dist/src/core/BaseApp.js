"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _cloneDeep = require("lodash.clonedeep");
const _merge = require("lodash.merge");
const JovoError_1 = require("../errors/JovoError");
const index_1 = require("../index");
const ComponentPlugin_1 = require("../plugins/ComponentPlugin");
const Handler_1 = require("../plugins/Handler");
const I18Next_1 = require("../plugins/I18Next");
const Router_1 = require("../plugins/Router");
const Log_1 = require("../util/Log");
const ActionSet_1 = require("./ActionSet");
const Extensible_1 = require("./Extensible");
const HandleRequest_1 = require("./HandleRequest");
process.on('unhandledRejection', (reason, p) => {
    Log_1.Log.error('unhandledRejection');
    Log_1.Log.error(p);
    if (reason) {
        if (reason.stack) {
            Log_1.Log.error(reason.stack);
        }
        Log_1.Log.error(reason);
    }
});
process.on('uncaughtException', (err) => {
    if (err.code && err.code === 'EADDRINUSE') {
        const usedPort = err.message.replace(/^\D+/g, '');
        err.message = `The port ${usedPort} is already in use.`;
        err.hint =
            'You might already run Jovo in a different tab. ' +
                'If the port is used by a different application, you can either change the port number in src/index.js, or specify the port as an option,' +
                ' e.g. jovo run --port 3301';
    }
    JovoError_1.JovoError.printError(err);
});
// @ts-ignore
process.env.JOVO_LOG_LEVEL = Log_1.LogLevel.INFO;
class BaseApp extends Extensible_1.Extensible {
    constructor(config) {
        super(config);
        this.config = {};
        this.$platform = new Map();
        this.$cms = {}; // tslint:disable-line
        this.$data = {};
        this.middlewares = [
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
        this.initialized = false;
        this.actionSet = new ActionSet_1.ActionSet(this.middlewares, this);
        if (process.env.NODE_ENV !== 'UNIT_TEST') {
            process.on('exit', () => {
                this.emit('exit');
            });
            // catch ctrl+c event and exit normally
            process.on('SIGINT', () => {
                process.exit(2);
            });
        }
        this.use(new I18Next_1.I18Next());
        this.use(new Router_1.Router());
        this.use(new Handler_1.Handler());
    }
    /**
     * Initialize setup middleware
     * @param {Function} callback
     */
    setUp(callback) {
        this.middleware('setup').use(callback);
    }
    /**
     * Is called on exit
     * IMPORTANT: Must have synchronous code only
     * @param {Function} callback
     */
    tearDown(callback) {
        this.on('exit', (jovo) => {
            callback(jovo);
        });
    }
    /**
     * Returns platform with given name.
     * @param {string} name
     * @returns {Platform | undefined}
     */
    getPlatformByName(name) {
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
        const appTypes = [];
        this.$platform.forEach((platform) => {
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
    hook(name, func) {
        if (!this.middleware(name)) {
            throw new JovoError_1.JovoError(`Can't find hook with name '${name}'`, 'jovo-core');
        }
        this.middleware(name).use(async (handleRequest) => {
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
            }
            else {
                await func.apply(undefined, [handleRequest.error, handleRequest.host, handleRequest.jovo]);
            }
        });
    }
    /**
     * Main entry method which handles the request.
     * @param {Host} host
     * @returns {Promise<void>}
     */
    async handle(host) {
        const handleRequest = new HandleRequest_1.HandleRequest(this, host);
        try {
            Log_1.Log.setRequestContext(host);
            Log_1.Log.verbose(Log_1.Log.header('Start request ', 'framework'));
            // initialize on first call only
            if (!this.initialized) {
                // First initialization of app object with first incoming request. Is executed once as long as app is alive
                // Useful for api calls that take longer. Results can be saved in the app object for a simple caching.
                await this.middleware('setup').run(handleRequest);
                this.initialized = true;
            }
            // Raw JSON request from platform gets processed. Can be used for authentication middlewares.
            await this.middleware('request').run(handleRequest);
            // Determines which platform (e.g. Alexa, GoogleAssistant) sent the request. Initialization of abstracted jovo (this) object.
            await this.middleware('platform.init').run(handleRequest);
            const shouldBeInitialized = !handleRequest.excludedMiddlewareNames ||
                !handleRequest.excludedMiddlewareNames.includes('platform.init');
            if (!handleRequest.jovo && shouldBeInitialized) {
                throw new JovoError_1.JovoError(`Can't handle request object.`, 'ERR_NO_MATCHING_PLATFORM', 'jovo-core', undefined, 'Please add an integration that handles that type of request.');
            }
            else if (handleRequest.jovo) {
                Log_1.Log.verbose(Log_1.Log.header('After init ', 'framework'));
                Log_1.Log.yellow().verbose(`this.\$${handleRequest.jovo.constructor.name
                    .substr(0, 1)
                    .toLowerCase()}${handleRequest.jovo.constructor.name.substr(1)} initialized`);
                Log_1.Log.yellow().verbose(`this.$type: ${JSON.stringify(handleRequest.jovo.$type)} `);
                Log_1.Log.yellow().verbose(`this.$session.$data : ${JSON.stringify(handleRequest.jovo.$session.$data)}`);
                Log_1.Log.verbose();
            }
            // Automatic speech recognition (ASR) information gets extracted.
            await this.middleware('asr').run(handleRequest);
            // 	Natural language understanding (NLU) information gets extracted for built-in NLUs (e.g. Alexa). Intents and inputs are set.
            await this.middleware('platform.nlu').run(handleRequest);
            // Request gets routed through external NLU (e.g. Dialogflow standalone). Intents and inputs are set.
            await this.middleware('nlu').run(handleRequest);
            if (handleRequest.jovo) {
                Log_1.Log.verbose(Log_1.Log.header('After nlu ', 'framework'));
                Log_1.Log.yellow().verbose(`this.$nlu : ${JSON.stringify(handleRequest.jovo.$nlu)}`);
                Log_1.Log.yellow().verbose(`this.$inputs : ${JSON.stringify(handleRequest.jovo.$inputs)}`);
            }
            // Initialization of user object. User data is retrieved from database.
            await this.middleware('user.load').run(handleRequest);
            // Request and NLU data (intent, input, state) is passed to router. intentMap and inputMap are executed. Handler path is generated.
            await this.middleware('router').run(handleRequest);
            // Handler logic is executed. Output object is created and finalized.
            await this.middleware('handler').run(handleRequest);
            // User gets finalized, DB operations.
            await this.middleware('user.save').run(handleRequest);
            if (handleRequest.jovo) {
                Log_1.Log.white().verbose(Log_1.Log.header(`Output object: this.$output`, 'framework'));
                Log_1.Log.yellow().verbose(JSON.stringify(handleRequest.jovo.$output, null, '\t'));
            }
            await this.middleware('tts').run(handleRequest);
            // Platform response JSON gets created from output object.
            await this.middleware('platform.output').run(handleRequest);
            Log_1.Log.verbose(Log_1.Log.header('Response ', 'framework'));
            // Response gets sent back to platform.
            await this.middleware('response').run(handleRequest);
        }
        catch (e) {
            JovoError_1.JovoError.printError(e);
            if (handleRequest.jovo) {
                Log_1.Log.error();
                Log_1.Log.error('Request details:');
                Log_1.Log.error(`this.\$${handleRequest.jovo.constructor.name
                    .substr(0, 1)
                    .toLowerCase()}${handleRequest.jovo.constructor.name.substr(1)} initialized`);
                Log_1.Log.error(`this.$type: ${JSON.stringify(handleRequest.jovo.$type)}`);
                Log_1.Log.error(`this.$session.$data : ${JSON.stringify(handleRequest.jovo.$session.$data)}`);
                Log_1.Log.error(`this.$nlu : ${JSON.stringify(handleRequest.jovo.$nlu)}`);
                Log_1.Log.error(`this.$inputs : ${JSON.stringify(handleRequest.jovo.$inputs)}`);
                Log_1.Log.error();
            }
            handleRequest.error = e;
            Log_1.Log.red().error(Log_1.Log.header());
            await this.middleware('fail').run(handleRequest);
            handleRequest.host.fail(e);
        }
    }
    /**
     *
     * @param {ComponentPlugin[]} components
     */
    useComponents(...components) {
        /**
         * router needs to access $components object,
         * which gets initialized in `initializeComponents`
         */
        this.middleware('before.router').use(ComponentPlugin_1.ComponentPlugin.initializeComponents);
        this.middleware('platform.output').use(ComponentPlugin_1.ComponentPlugin.saveComponentSessionData);
        components.forEach((componentPlugin) => {
            this.middleware('setup').use(componentPlugin.setAsBaseComponent.bind(componentPlugin));
            componentPlugin.name = componentPlugin.name || componentPlugin.constructor.name;
            if (this.config.components) {
                const componentAppConfig = _cloneDeep(this.config.components[componentPlugin.name]); // config defined in project's main config.js file
                _merge(componentPlugin.config, componentAppConfig);
            }
            componentPlugin.install(this);
            /**
             * 1st layer components handler have to be set after the child component's handler were merged
             * currently they are merged in `after.setup`
             */
            this.middleware('before.request').use(componentPlugin.setHandler.bind(componentPlugin));
            this.$plugins.set(componentPlugin.name, componentPlugin);
            this.emit('use', componentPlugin);
            if (this.constructor.name === 'App') {
                Log_1.Log.yellow().verbose(`Installed component: ${componentPlugin.name}`);
                Log_1.Log.debug(`${JSON.stringify(componentPlugin.config || {}, null, '\t')}`);
                Log_1.Log.debug();
            }
        });
    }
    getProject() {
        return index_1.Project;
    }
    /**
     * On request listener
     * @param {Function} callback
     */
    onRequest(callback) {
        this.on('request', (handleRequest) => {
            callback(handleRequest);
        });
    }
    /**
     * On response listener
     * @param {Function} callback
     */
    onResponse(callback) {
        this.on('response', (handleRequest) => {
            callback(handleRequest);
        });
    }
    /**
     * On error listener. Same as the onFail listener
     * @param {Function} callback
     */
    onError(callback) {
        this.on('fail', (handleRequest) => {
            callback(handleRequest);
        });
    }
    /**
     * On fail listener
     * @param {Function} callback
     */
    onFail(callback) {
        this.on('fail', (handleRequest) => {
            callback(handleRequest);
        });
    }
    /**
     * BaseApp install method. Nothing to do here
     * @param extensible
     */
    install(extensible) {
        // tslint:disable-line:no-empty
    }
    /**
     * BaseApp uninstall method. Nothing to do here
     * @param extensible
     */
    uninstall(extensible) {
        // tslint:disable-line:no-empty
    }
}
exports.BaseApp = BaseApp;
/**
 * Helper
 * Returns array of parameter names from a function.
 * @param {Function} func
 * @returns {string[]}
 */
function getParamNames(func) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }
    return result;
}
//# sourceMappingURL=BaseApp.js.map