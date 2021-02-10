"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const AutopilotRequestBuilder_1 = require("./core/AutopilotRequestBuilder");
const AutopilotResponseBuilder_1 = require("./core/AutopilotResponseBuilder");
const AutopilotCore_1 = require("./modules/AutopilotCore");
const AutopilotNLU_1 = require("./modules/AutopilotNLU");
const AudioPlayer_1 = require("./modules/AudioPlayer");
const Cards_1 = require("./modules/Cards");
class Autopilot extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new jovo_core_1.ActionSet([
            'setup',
            '$init',
            '$request',
            '$session',
            '$user',
            '$type',
            '$nlu',
            '$inputs',
            '$tts',
            '$output',
            '$response',
        ], this);
    }
    getAppType() {
        return 'AutopilotBot';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        this.use(new AutopilotCore_1.AutopilotCore(), new AutopilotNLU_1.AutopilotNLU(), new AudioPlayer_1.AudioPlayerPlugin(), new Cards_1.Cards());
        jovo_core_1.Jovo.prototype.$autopilotBot = undefined;
        jovo_core_1.Jovo.prototype.autopilotBot = function () {
            if (this.constructor.name !== 'AutopilotBot') {
                throw new jovo_core_1.JovoError(`Can't handle request. Please use this.isAutopilotBot()`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-autopilot');
            }
            return this;
        };
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(new AutopilotRequestBuilder_1.AutopilotRequestBuilder(), new AutopilotResponseBuilder_1.AutopilotResponseBuilder());
    }
    async initialize(handleRequest) {
        var _a;
        handleRequest.platformClazz = Autopilot;
        await this.middleware('$init').run(handleRequest);
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== 'AutopilotBot') {
            return Promise.resolve();
        }
        await this.middleware('$request').run(handleRequest.jovo);
        await this.middleware('$type').run(handleRequest.jovo);
        await this.middleware('$session').run(handleRequest.jovo);
        if (this.config.handlers) {
            handleRequest.app.config.handlers = _merge(handleRequest.app.config.handlers, this.config.handlers);
        }
    }
    async nlu(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== 'AutopilotBot') {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async tts(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== 'AutopilotBot') {
            return Promise.resolve();
        }
        await this.middleware('$tts').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== 'AutopilotBot') {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== 'AutopilotBot') {
            return Promise.resolve();
        }
        await this.middleware('$response').run(handleRequest.jovo);
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
}
exports.Autopilot = Autopilot;
//# sourceMappingURL=Autopilot.js.map