import * as _ from 'lodash';
import {
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
import {Jovo} from "../../../jovo-core/dist/src";

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
            this.config = _.merge(this.config, config);
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

    makeTestSuite() {
        return new TestSuite(new DialogflowRequestBuilder(), new DialogflowResponseBuilder());
    }

    install(app: BaseApp) {
        app.$platform.set(this.constructor.name, this);

        // Register to BaseApp middleware
        app.middleware('platform.init')!.use(this.initialize.bind(this));
        app.middleware('platform.nlu')!.use(this.nlu.bind(this));
        app.middleware('output')!.use(this.output.bind(this));
        app.middleware('response')!.use(this.response.bind(this));

        this.use(
            new DialogflowCore()
        );
    }
    uninstall(app: BaseApp) {

    }

    async initialize(handleRequest: HandleRequest) {

        handleRequest.jovo = new DialogflowAgent(handleRequest.app, handleRequest.host);

        this.middleware('$request')!.run(handleRequest.jovo);
        this.middleware('$session')!.run(handleRequest.jovo);
        this.middleware('$type')!.run(handleRequest.jovo);

    }


    async nlu(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        this.middleware('$nlu')!.run(handleRequest.jovo);
        this.middleware('$inputs')!.run(handleRequest.jovo);

    }


    async output(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        this.middleware('$output')!.run(handleRequest.jovo);
    }

    async response(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$response')!.run(handleRequest.jovo);
        handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
}
