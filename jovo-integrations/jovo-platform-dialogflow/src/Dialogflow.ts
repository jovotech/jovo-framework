import _merge = require('lodash.merge');
import {
    Jovo,
    BaseApp,
    Extensible,
    Platform,
    TestSuite,
    HandleRequest, ActionSet, ExtensibleConfig
} from "jovo-core";
import {DialogflowAgent} from "./DialogflowAgent";
import {DialogflowCore} from "./DialogflowCore";
import {DialogflowRequestBuilder} from "./core/DialogflowRequestBuilder";
import {DialogflowResponseBuilder} from "./core/DialogflowResponseBuilder";
import {DialogflowTestSuite} from './core/Interfaces';

export interface DialogflowConfig extends ExtensibleConfig {
}

export class Dialogflow extends Extensible implements Platform {

    requestBuilder = new DialogflowRequestBuilder();
    responseBuilder = new DialogflowResponseBuilder();

    config: DialogflowConfig = {
        enabled: true,
    };

    constructor(config?: DialogflowConfig) {
        super(config);

        if (config) {
            this.config = _merge(this.config, config);
        }

        this.actionSet = new ActionSet([
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

    makeTestSuite(): DialogflowTestSuite {
        return new TestSuite(new DialogflowRequestBuilder(), new DialogflowResponseBuilder());
    }

    install(app: BaseApp) {
        app.$platform.set(this.constructor.name, this);

        // Register to BaseApp middleware
        app.middleware('platform.init')!.use(this.initialize.bind(this));
        app.middleware('platform.nlu')!.use(this.nlu.bind(this));
        app.middleware('platform.output')!.use(this.output.bind(this));
        app.middleware('response')!.use(this.response.bind(this));

        this.use(
            new DialogflowCore()
        );

        Jovo.prototype.$dialogflowAgent = undefined;
    }


    uninstall(app: BaseApp) {

    }

    async initialize(handleRequest: HandleRequest) {

        const requestObject = handleRequest.host.$request;

        if (requestObject.responseId &&
            requestObject.queryResult &&
            requestObject.originalDetectIntentRequest &&
            requestObject.originalDetectIntentRequest.source !== 'google') {
            handleRequest.jovo = new DialogflowAgent(handleRequest.app, handleRequest.host);
        }
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$request')!.run(handleRequest.jovo);
        await this.middleware('$session')!.run(handleRequest.jovo);


        await this.middleware('$type')!.run(handleRequest.jovo);

    }


    async nlu(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$nlu')!.run(handleRequest.jovo);
        await this.middleware('$inputs')!.run(handleRequest.jovo);

    }


    async output(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$output')!.run(handleRequest.jovo);
    }

    async response(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$response')!.run(handleRequest.jovo);
        handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
}
