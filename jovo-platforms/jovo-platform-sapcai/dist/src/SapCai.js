"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const _merge = require("lodash.merge");
const jovo_core_1 = require("jovo-core");
const _1 = require(".");
class SapCai extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.requestBuilder = new _1.SapCaiRequestBuilder();
        this.responseBuilder = new _1.SapCaiResponseBuilder();
        this.config = {
            enabled: true,
            plugin: {},
            handlers: undefined,
            useLaunch: true,
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    getAppType() {
        return 'SapCaiSkill';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        app.middleware('fail').use((handleRequest) => {
            if (!handleRequest.jovo) {
                return;
            }
            if (this.config.defaultResponseOnFail) {
                if (!_get(handleRequest.jovo.$handlers, jovo_core_1.EnumRequestType.ON_ERROR)) {
                    app.middleware('response').run(handleRequest);
                }
            }
        });
        this.use(new _1.SapCaiCore(), new _1.SapCaiNlu(), new _1.Cards());
        jovo_core_1.Jovo.prototype.$caiSkill = undefined;
        jovo_core_1.Jovo.prototype.caiSkill = function () {
            if (this.constructor.name !== 'SapCaiSkill') {
                throw Error(`Can't handle request. Please use this.isCaiSkill()`);
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isCaiSkill = function () {
            return this.constructor.name === 'SapCaiSkill';
        };
        //tslint:disable-next-line:no-any
        jovo_core_1.BaseApp.prototype.setCaiHandler = function (...handlers) {
            // tslint:disable-line
            for (const obj of handlers) {
                // eslint-disable-line
                if (typeof obj !== 'object') {
                    throw new Error('Handler must be of type object.');
                }
                const sourceHandler = _get(this.config, 'plugin.SapCai.handlers');
                _set(this.config, 'plugin.SapCai.handlers', _merge(sourceHandler, obj));
            }
            return this;
        };
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(new _1.SapCaiRequestBuilder(), new _1.SapCaiResponseBuilder());
    }
    async initialize(handleRequest) {
        handleRequest.platformClazz = _1.SapCaiSkill;
        await this.middleware('$init').run(handleRequest);
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
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
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
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
exports.SapCai = SapCai;
//# sourceMappingURL=SapCai.js.map