"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const jovo_db_platformstorage_1 = require("jovo-db-platformstorage");
const _1 = require(".");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
class CorePlatform extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.requestBuilder = this.getRequestBuilder();
        this.responseBuilder = this.getResponseBuilder();
        this.config = {
            defaultOutputAction: _1.ActionType.Speech,
            enabled: true,
        };
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
            '$asr',
            '$nlu',
            '$inputs',
            '$tts.before',
            '$tts',
            '$output',
            '$response',
        ], this);
    }
    getAppType() {
        return 'CorePlatformApp';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('asr').use(this.asr.bind(this));
        app.middleware('nlu').use(this.nlu.bind(this));
        app.middleware('before.tts').use(this.beforeTTS.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        app.use(new jovo_db_platformstorage_1.PlatformStorage());
        this.use(new _1.CorePlatformCore());
        this.augmentJovoPrototype();
    }
    async setup(handleRequest) {
        await this.middleware('setup').run(handleRequest);
    }
    async initialize(handleRequest) {
        handleRequest.platformClazz = this.appClass;
        await this.middleware('$init').run(handleRequest);
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$request').run(handleRequest.jovo);
        await this.middleware('$type').run(handleRequest.jovo);
        await this.middleware('$session').run(handleRequest.jovo);
        if (this.config.handlers) {
            _set(handleRequest.app, 'config.handlers', _merge(_get(handleRequest.app, 'config.handlers'), this.config.handlers));
        }
    }
    async asr(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$asr').run(handleRequest.jovo);
    }
    async nlu(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async beforeTTS(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$tts.before').run(handleRequest.jovo);
    }
    async tts(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$tts').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
            return Promise.resolve();
        }
        await this.middleware('$response').run(handleRequest.jovo);
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(this.getRequestBuilder(), this.getResponseBuilder());
    }
    get appClass() {
        return _1.CorePlatformApp;
    }
    augmentJovoPrototype() {
        jovo_core_1.Jovo.prototype.$corePlatformApp = undefined;
        jovo_core_1.Jovo.prototype.corePlatformApp = function () {
            if (this.constructor.name !== 'CorePlatformApp') {
                throw Error(`Can't handle request. Please use this.isCorePlatformApp()`);
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isCorePlatformApp = function () {
            return this.constructor.name === 'CorePlatformApp';
        };
    }
    getRequestBuilder() {
        return new _1.CorePlatformRequestBuilder();
    }
    getResponseBuilder() {
        return new _1.CorePlatformResponseBuilder();
    }
}
exports.CorePlatform = CorePlatform;
//# sourceMappingURL=CorePlatform.js.map