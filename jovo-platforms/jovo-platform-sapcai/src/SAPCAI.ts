import { SAPCAICore } from './SAPCAICore';
import { SAPCAINLU } from './SAPCAINLU';
import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');

import {
    BaseApp,
    Extensible,
    Platform,
    TestSuite,
    HandleRequest, ActionSet, ExtensibleConfig, Jovo, EnumRequestType
} from "jovo-core";
import { SAPCAISkill } from './SAPCAISkill';
import { Cards } from './Cards';
import { SAPCAIRequestBuilder } from './SAPCAIRequestBuilder';
import { SAPCAIResponseBuilder } from './SAPCAIResponseBuilder';

export interface Config extends ExtensibleConfig {
    handlers?: any; //tslint:disable-line
}

export class SAPCAI extends Extensible implements Platform {

    
    requestBuilder = new SAPCAIRequestBuilder();
    responseBuilder = new SAPCAIResponseBuilder();

    config: Config = {
        enabled: true,
        plugin: {},
        handlers: undefined,
    };

    constructor(config?: Config) {
        super(config);

        if (config) {
            this.config = _merge(this.config, config);
        }

        this.actionSet = new ActionSet([
            '$init',
            '$request',
            '$session',
            '$user',
            '$type',
            '$nlu',
            '$inputs',
            '$output',
            '$response'
        ], this);
    }

    getAppType(): string {
        return 'SAPCAISkill';
    }


    install(app: BaseApp) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('platform.init')!.use(this.initialize.bind(this));
        app.middleware('platform.nlu')!.use(this.nlu.bind(this));
        app.middleware('platform.output')!.use(this.output.bind(this));
        app.middleware('response')!.use(this.response.bind(this));


        app.middleware('fail')!.use((handleRequest: HandleRequest) => {
            if (!handleRequest.jovo) {
                return;
            }

            if (this.config.defaultResponseOnFail) {
                if (!_get(handleRequest.jovo.$handlers, EnumRequestType.ON_ERROR)) {
                    app.middleware('response')!.run(handleRequest);
                }
            }
        });


        this.use(
            new SAPCAICore(),
            new SAPCAINLU(),
            new Cards()
        );

        Jovo.prototype.$sapcaiSkill = undefined;
        Jovo.prototype.sapcaiSkill = function() {
            if (this.constructor.name !== 'SAPCAISkill'  ) {
                throw Error(`Can't handle request. Please use this.isSAPCAISkill()`);
            }
            return this as SAPCAISkill;
        };
        Jovo.prototype.isSAPCAISkill = function() {
            return this.constructor.name === 'SAPCAISkill';
        };

        BaseApp.prototype.setSAPCAIHandler = function(...handlers: any[]) { // tslint:disable-line
            for (const obj of handlers) { // eslint-disable-line
                if (typeof obj !== 'object') {
                    throw new Error('Handler must be of type object.');
                }
                const sourceHandler = _get(this.config.plugin,'SAPCAI.handlers');
                _set(this.config.plugin, 'SAPCAI.handlers', _merge(sourceHandler,obj));
            }
            return this;
        };

    }

    //TODO
    makeTestSuite(): any {
        return new TestSuite(new SAPCAIRequestBuilder(), new SAPCAIResponseBuilder());
    }


    async initialize(handleRequest: HandleRequest) {
        //TODO
        //handleRequest.platformClazz = AlexaSkill;
        await this.middleware('$init')!.run(handleRequest);

        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SAPCAISkill') {
            return Promise.resolve();
        }
        await this.middleware('$request')!.run(handleRequest.jovo);
        await this.middleware('$type')!.run(handleRequest.jovo);
        await this.middleware('$session')!.run(handleRequest.jovo);


        if (this.config.handlers) {
             _set(handleRequest.app, 'config.handlers', _merge( _get(handleRequest.app, 'config.handlers'), this.config.handlers));
        }
    }


    async nlu(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SAPCAISkill') {
            return Promise.resolve();
        }
        await this.middleware('$nlu')!.run(handleRequest.jovo);
        await this.middleware('$inputs')!.run(handleRequest.jovo);

    }

    async output(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SAPCAISkill') {
            return Promise.resolve();
        }
        await this.middleware('$output')!.run(handleRequest.jovo);
    }
    async response(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SAPCAISkill') {
            return Promise.resolve();
        }
        await this.middleware('$response')!.run(handleRequest.jovo);

        handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson ?
            this.responseBuilder.create(handleRequest.jovo.$rawResponseJson) : handleRequest.jovo.$response;

        handleRequest.jovo.$response = handleRequest.jovo.$response;
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    uninstall(app: BaseApp) {

    }
}
