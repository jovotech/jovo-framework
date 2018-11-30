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
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('output').use(this.output.bind(this));

        this.use(
            new DialogflowCore()
        );
    }
    uninstall(app: BaseApp) {

    }

    async initialize(handleRequest: HandleRequest) {

        handleRequest.jovo = new DialogflowAgent(handleRequest.app, handleRequest.host);

        this.middleware('$request').run(handleRequest.jovo);
        this.middleware('$session').run(handleRequest.jovo);
        this.middleware('$type').run(handleRequest.jovo);

    }


    async nlu(handleRequest: HandleRequest) {
        this.middleware('$nlu').run(handleRequest.jovo);
    }

    async output(handleRequest: HandleRequest) {
        this.middleware('$output').run(handleRequest.jovo);
    }

}
