"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const jovo_core_1 = require("jovo-core");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const BixbyRequestBuilder_1 = require("./core/BixbyRequestBuilder");
const BixbyCore_1 = require("./core/BixbyCore");
const BixbyCapsule_1 = require("./core/BixbyCapsule");
const BixbyResponseBuilder_1 = require("./core/BixbyResponseBuilder");
const BixbyNLU_1 = require("./modules/BixbyNLU");
const BixbyAudioPlayer_1 = require("./modules/BixbyAudioPlayer");
class Bixby extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.requestBuilder = new BixbyRequestBuilder_1.BixbyRequestBuilder();
        this.responseBuilder = new BixbyResponseBuilder_1.BixbyResponseBuilder();
        this.config = {
            enabled: true,
        };
        if (config) {
            this.config = lodash_merge_1.default(this.config, config);
        }
    }
    getAppType() {
        return 'BixbyCapsule';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        app.middleware('fail').use(this.fail.bind(this));
        this.use(new BixbyCore_1.BixbyCore(), new BixbyNLU_1.BixbyNLU(), new BixbyAudioPlayer_1.BixbyAudioPlayerPlugin());
        jovo_core_1.Jovo.prototype.$bixbyCapsule = undefined;
        jovo_core_1.Jovo.prototype.bixbyCapsule = function () {
            if (this.constructor.name !== 'BixbyCapsule') {
                throw new jovo_core_1.JovoError("Can't handle request. Please use this.isBixbyCapsule()", jovo_core_1.ErrorCode.ERR, 'jovo-platform-bixby');
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isBixbyCapsule = function () {
            return this.constructor.name === 'BixbyCapsule';
        };
        // tslint:disable-next-line
        jovo_core_1.BaseApp.prototype.setBixbyHandler = function (...handlers) {
            for (const obj of handlers) {
                if (typeof obj !== 'object') {
                    throw new jovo_core_1.JovoError('Handler must be of type object');
                }
                const sourceHandler = _get(this.config.plugin, 'Bixby.handlers');
                _set(this.config, 'plugin.Bixby.handlers', lodash_merge_1.default(sourceHandler, obj));
            }
            return this;
        };
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(new BixbyRequestBuilder_1.BixbyRequestBuilder(), new BixbyResponseBuilder_1.BixbyResponseBuilder());
    }
    async initialize(handleRequest) {
        handleRequest.platformClazz = BixbyCapsule_1.BixbyCapsule;
        await this.middleware('$init').run(handleRequest);
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
            return Promise.resolve();
        }
        await this.middleware('$request').run(handleRequest.jovo);
        await this.middleware('$type').run(handleRequest.jovo);
        await this.middleware('$session').run(handleRequest.jovo);
    }
    async nlu(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
            return Promise.resolve();
        }
        await this.middleware('$response').run(handleRequest.jovo);
        handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson
            ? this.responseBuilder.create(handleRequest.jovo.$rawResponseJson)
            : handleRequest.jovo.$response;
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    fail() {
        // TODO implement
    }
    supportsASR() {
        return false;
    }
    supportsTTS() {
        return false;
    }
}
exports.Bixby = Bixby;
//# sourceMappingURL=Bixby.js.map