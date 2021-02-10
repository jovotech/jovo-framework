"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const jovo_core_1 = require("jovo-core");
const DialogflowAgent_1 = require("./DialogflowAgent");
const DialogflowCore_1 = require("./DialogflowCore");
const DialogflowRequestBuilder_1 = require("./core/DialogflowRequestBuilder");
const DialogflowResponseBuilder_1 = require("./core/DialogflowResponseBuilder");
const DialogflowFactory_1 = require("./core/DialogflowFactory");
class Dialogflow extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.requestBuilder = new DialogflowRequestBuilder_1.DialogflowRequestBuilder(new DialogflowFactory_1.DialogflowFactory());
        this.responseBuilder = new DialogflowResponseBuilder_1.DialogflowResponseBuilder(new DialogflowFactory_1.DialogflowFactory());
        this.config = {
            enabled: true,
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(this.requestBuilder, this.responseBuilder);
    }
    getAppType() {
        return 'DialogflowAgent';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        // Register to BaseApp middleware
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        this.use(new DialogflowCore_1.DialogflowCore());
        jovo_core_1.Jovo.prototype.$dialogflowAgent = undefined;
    }
    uninstall(app) { }
    async initialize(handleRequest) {
        const requestObject = handleRequest.host.$request;
        if (requestObject.responseId &&
            requestObject.queryResult &&
            requestObject.originalDetectIntentRequest &&
            (!requestObject.originalDetectIntentRequest.source ||
                requestObject.originalDetectIntentRequest.source !== 'google')) {
            handleRequest.jovo = new DialogflowAgent_1.DialogflowAgent(handleRequest.app, handleRequest.host, handleRequest);
        }
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$request').run(handleRequest.jovo);
        await this.middleware('$session').run(handleRequest.jovo);
        await this.middleware('$type').run(handleRequest.jovo);
    }
    async nlu(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async tts(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$tts').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'DialogflowAgent') {
            return Promise.resolve();
        }
        await this.middleware('$response').run(handleRequest.jovo);
        handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
}
exports.Dialogflow = Dialogflow;
//# sourceMappingURL=Dialogflow.js.map