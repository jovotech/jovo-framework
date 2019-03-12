import {Extensible, ExtensibleConfig} from "./Extensible";
import {AppData, Db, HandleRequest, Host, Platform} from "./Interfaces";
import {ActionSet} from "./ActionSet";
import {Log, LogLevel} from "./Log";
import {JovoError} from "./errors/JovoError";

process.on('unhandledRejection', (reason, p) => {
    console.log('unhandledRejection');
    console.log(p);
    console.log(reason.stack);
    console.log(reason);
});

process.on('uncaughtException', (err) => {
    JovoError.printError(err as JovoError);
});

export type BaseAppMiddleware = 'setup' | 'request' | 'platform.init' | 'platform.nlu' | 'nlu' | 'user.load' | 'router' | 'handler' |
    'user.save' | 'platform.output' | 'response' | 'fail';

export interface BaseAppConfig extends ExtensibleConfig {
    inputMap?: {[key: string]: string};
}

// @ts-ignore
process.env.JOVO_LOG_LEVEL = LogLevel.INFO;


export class BaseApp extends Extensible {
    private initialized = false;

    config: BaseAppConfig = {

    };

    $platform: Map<string, Platform> = new Map();

    $db!: Db;
    $cms: any = {}; // tslint:disable-line

    $data: AppData = {};

    middlewares: BaseAppMiddleware[] = [
        'setup',
        'request',
        'platform.init',
        'platform.nlu',
        'nlu',
        'user.load',
        'router',
        'handler',
        'user.save',
        'platform.output',
        'response',
        'fail'
    ];

    constructor(config?: BaseAppConfig) {
        super(config);

        this.actionSet = new ActionSet(this.middlewares, this);

        if (process.env.NODE_ENV !== 'UNIT_TEST') {
            process.on('exit',  () => {
                this.emit('exit');
            });


            // catch ctrl+c event and exit normally
            process.on('SIGINT', () => {
                process.exit(2);
            });
        }
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
            throw new JovoError(
                `Can't find hook with name '${name}'`,
                'jovo-core',
            );
        }

        this.middleware(name)!.use(async(handleRequest: HandleRequest) => {

            const params = getParamNames(func);

            // callback parameter is available, wait before it gets called
            if (params.length === 4) {
                await new Promise((resolve) => {
                    func.apply(undefined, [handleRequest.error, handleRequest.host, handleRequest.jovo, resolve]);
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
        const handleRequest: HandleRequest = {
            app: this,
            host,
            jovo: undefined
        };
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
            if (!handleRequest.jovo) {
                throw new JovoError(
                    `Can't handle request object.`,
                    'ERR_NO_MATCHING_PLATFORM',
                    'jovo-core',
                    undefined,
                    'Please add an integration that handles that type of request.');
            }
            Log.verbose(Log.header('After init ', 'framework'));

            Log.yellow().verbose(`this.\$${handleRequest.jovo.constructor.name.substr(0,1).toLowerCase()}${handleRequest.jovo.constructor.name.substr(1)} initialized`);
            Log.yellow().verbose(`this.$type: ${JSON.stringify(handleRequest.jovo.$type)}`);
            Log.yellow().verbose(`this.$session.$data : ${JSON.stringify(handleRequest.jovo.$session.$data)}`);
            Log.verbose();

            // 	Natural language understanding (NLU) information gets extracted for built-in NLUs (e.g. Alexa). Intents and inputs are set.
            await this.middleware('platform.nlu')!.run(handleRequest);

            // Request gets routed through external NLU (e.g. Dialogflow standalone). Intents and inputs are set.
            await this.middleware('nlu')!.run(handleRequest);

            Log.verbose(Log.header('After nlu ', 'framework'));
            Log.yellow().verbose(`this.$nlu : ${JSON.stringify(handleRequest.jovo.$nlu)}`);
            Log.yellow().verbose(`this.$inputs : ${JSON.stringify(handleRequest.jovo.$inputs)}`);


            // Initialization of user object. User data is retrieved from database.
            await this.middleware('user.load')!.run(handleRequest);


            // Request and NLU data (intent, input, state) is passed to router. intentMap and inputMap are executed. Handler path is generated.
            await this.middleware('router')!.run(handleRequest);

            // Handler logic is executed. Output object is created and finalized.
            await this.middleware('handler')!.run(handleRequest);

            // User gets finalized, DB operations.
            await this.middleware('user.save')!.run(handleRequest);


            Log.white().verbose(Log.header(`Output object: this.$output`, 'framework'));
            Log.yellow().verbose(JSON.stringify(handleRequest.jovo.$output, null, '\t'));

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
                Log.error(`this.\$${handleRequest.jovo.constructor.name.substr(0,1).toLowerCase()}${handleRequest.jovo.constructor.name.substr(1)} initialized`);
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

    install(extensible: Extensible) {

    }

    uninstall(extensible: Extensible) {

    }
}


/**
 * Helper
 * Returns array of parameter names from a function.
 * @param {Function} func
 * @returns {string[]}
 */
function getParamNames(func: Function): string[] {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }
    return result;
}
