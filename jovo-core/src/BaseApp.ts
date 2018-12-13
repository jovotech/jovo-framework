import {Extensible, ExtensibleConfig} from "./Extensible";
import {AppData, Db, HandleRequest, Host, Platform} from "./Interfaces";
import {ActionSet} from "./ActionSet";

process.on('unhandledRejection', (reason, p) => {
    console.log('unhandledRejection');
    console.log(p);
    console.log(reason.stack);
    console.log(reason);
});
export interface BaseAppConfig extends ExtensibleConfig {
    inputMap?: {[key: string]: string};
}


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
            'platform.output',
            'user.save',
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
        this.emit('init-webhook');
    }

    async handle(host: Host) {
        const handleRequest: HandleRequest = {
            app: this,
            host,
            jovo: undefined
        };
        try {
            // initialize on first call only
            if (!this.initialized) {
                await this.middleware('setup')!.run(handleRequest);
                this.initialized = true;
            }
            await this.middleware('request')!.run(handleRequest);
            await this.middleware('platform.init')!.run(handleRequest);

            if (!handleRequest.jovo) {
                throw new Error(`Can't handle request object.`);
            }
            await this.middleware('platform.nlu')!.run(handleRequest);
            await this.middleware('nlu')!.run(handleRequest);
            await this.middleware('user.load')!.run(handleRequest);
            await this.middleware('router')!.run(handleRequest);
            await this.middleware('handler')!.run(handleRequest);
            await this.middleware('finalize.user')!.run(handleRequest);
            await this.middleware('platform.output')!.run(handleRequest);
            await this.middleware('response')!.run(handleRequest);
        } catch (e) {
            console.log(e);
            handleRequest.error = e;
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
