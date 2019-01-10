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
export interface BaseAppConfig extends ExtensibleConfig {
    inputMap?: {[key: string]: string};
}
process.env.JOVO_LOG_LEVEL = LogLevel.INFO+'';

export class BaseApp extends Extensible {
    private initialized = false;

    config: BaseAppConfig = {

    };

    $platform: Map<string, Platform> = new Map();

    $db!: Db;
    $cms: any = {}; // tslint:disable-line

    $data: AppData = {};

    actionSet: ActionSet;

    constructor(config?: BaseAppConfig) {
        super(config);

        this.actionSet = new ActionSet([
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
        ], this);

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


    getPlatformByName(name: string) {
        return this.$platform.get(name);
    }


    initWebhook() {
        this.emit('webhook.init');
    }

    async handle(host: Host) {
        const handleRequest: HandleRequest = {
            app: this,
            host,
            jovo: undefined
        };
        try {

            Log.verbose(Log.header('Start request', 'framework'));

            // initialize on first call only
            if (!this.initialized) {

                await this.middleware('setup')!.run(handleRequest);
                this.initialized = true;
            }
            await this.middleware('request')!.run(handleRequest);
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

            await this.middleware('platform.nlu')!.run(handleRequest);
            await this.middleware('nlu')!.run(handleRequest);

            Log.verbose(Log.header('After nlu ', 'framework'));
            Log.yellow().verbose(`this.$nlu : ${JSON.stringify(handleRequest.jovo.$nlu)}`);
            Log.yellow().verbose(`this.$inputs : ${JSON.stringify(handleRequest.jovo.$inputs)}`);

            await this.middleware('user.load')!.run(handleRequest);

            await this.middleware('router')!.run(handleRequest);

            await this.middleware('handler')!.run(handleRequest);
            await this.middleware('user.save')!.run(handleRequest);


            Log.white().verbose(Log.header(`Output object: this.$output`, 'framework'));
            Log.yellow().verbose(JSON.stringify(handleRequest.jovo.$output, null, '\t'));
            await this.middleware('platform.output')!.run(handleRequest);


            Log.verbose(Log.header('Response ', 'framework'));

            await this.middleware('response')!.run(handleRequest);
        } catch (e) {

            Log.red().error(Log.header('Error'));


            if (e.code) {
                Log.error('Code:');
                Log.error(e.code);
                Log.error();
            }
            Log.error('Message:');
            Log.error(e.message);

            Log.error();
            Log.error('Stack:');
            Log.error(e.stack);

            if (e.details) {
                Log.error();
                Log.error('Details:');
                Log.error(e.details);
            }

            if (e.hint) {
                Log.error();
                Log.error('Hint:');
                Log.error(e.hint);
            }

            if (e.seeMore) {
                Log.error();
                Log.error('See more:');
                Log.error(e.seeMore);
            }


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
        }
    }

    onError(callback: Function) {
        this.on('fail', (handleRequest: HandleRequest) => {
            callback(handleRequest);
        });
    }

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
