"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const jovo_core_1 = require("jovo-core");
const jovo_platform_dialogflow_1 = require("jovo-platform-dialogflow");
const GoogleAssistantRequestBuilder_1 = require("./core/GoogleAssistantRequestBuilder");
const GoogleAssistantResponseBuilder_1 = require("./core/GoogleAssistantResponseBuilder");
const GoogleAssistantDialogflowFactory_1 = require("./dialogflow/GoogleAssistantDialogflowFactory");
const AskFor_1 = require("./modules/AskFor");
const Cards_1 = require("./modules/Cards");
const GoogleAssistantCore_1 = require("./modules/GoogleAssistantCore");
const InteractiveCanvas_1 = require("./modules/InteractiveCanvas");
const MediaResponse_1 = require("./modules/MediaResponse");
const NewSurface_1 = require("./modules/NewSurface");
const Transaction_1 = require("./modules/Transaction");
const Updates_1 = require("./modules/Updates");
class GoogleAssistant extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.config = {
            enabled: true,
            plugin: {},
        };
        this.requestBuilder = new GoogleAssistantRequestBuilder_1.GoogleAssistantRequestBuilder();
        this.responseBuilder = new GoogleAssistantResponseBuilder_1.GoogleAssistantResponseBuilder();
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    getAppType() {
        return 'GoogleAction';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        this.use(new GoogleAssistantCore_1.GoogleAssistantCore(), new Cards_1.Cards(), new AskFor_1.AskFor(), new MediaResponse_1.MediaResponsePlugin(), new Updates_1.UpdatesPlugin(), new Transaction_1.TransactionsPlugin(), new InteractiveCanvas_1.InteractiveCanvas(), new NewSurface_1.NewSurface());
        jovo_core_1.Jovo.prototype.$googleAction = undefined;
        jovo_core_1.Jovo.prototype.googleAction = function () {
            if (this.constructor.name !== 'GoogleAction') {
                throw Error(`Can't handle request. Please use this.isGoogleAction()`);
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isGoogleAction = function () {
            return this.constructor.name === 'GoogleAction';
        };
        jovo_core_1.BaseApp.prototype.setGoogleAssistantHandler = function (...handlers) {
            for (const obj of handlers) {
                if (typeof obj !== 'object') {
                    throw new Error('Handler must be of type object.');
                }
                const sourceHandler = _get(this.config, 'plugin.GoogleAssistant.handlers');
                _set(this.config, 'plugin.GoogleAssistant.handlers', _merge(sourceHandler, obj));
            }
            return this;
        };
        this.initDialogflow();
    }
    makeTestSuite() {
        this.remove('DialogflowPlugin');
        this.initDialogflow();
        return new jovo_core_1.TestSuite(this.requestBuilder, this.responseBuilder);
    }
    initDialogflow() {
        this.use(new jovo_platform_dialogflow_1.DialogflowPlugin({}, new GoogleAssistantDialogflowFactory_1.GoogleAssistantDialogflowFactory()));
    }
    async initialize(handleRequest) {
        await this.middleware('$init').run(handleRequest);
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'GoogleAction') {
            return Promise.resolve();
        }
        await this.middleware('$request').run(handleRequest.jovo);
        await this.middleware('$type').run(handleRequest.jovo);
        await this.middleware('$session').run(handleRequest.jovo);
        if (this.config.handlers) {
            _set(handleRequest.app, 'config.handlers', _merge(_get(handleRequest.app, 'config.handlers'), this.config.handlers));
        }
    }
    async nlu(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'GoogleAction') {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'GoogleAction') {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'GoogleAction') {
            return Promise.resolve();
        }
        await this.middleware('$response').run(handleRequest.jovo);
        handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson
            ? this.responseBuilder.create(handleRequest.jovo.$rawResponseJson)
            : handleRequest.jovo.$response;
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    uninstall(app) { }
}
exports.GoogleAssistant = GoogleAssistant;
//# sourceMappingURL=GoogleAssistant.js.map