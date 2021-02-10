"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const LindenbaumRequestBuilder_1 = require("./core/LindenbaumRequestBuilder");
const LindenbaumResponseBuilder_1 = require("./core/LindenbaumResponseBuilder");
const LindenbaumCore_1 = require("./modules/LindenbaumCore");
class Lindenbaum extends jovo_core_1.Platform {
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
        return Lindenbaum.appType;
    }
    install(app) {
        var _a;
        if (!((_a = app.config.user) === null || _a === void 0 ? void 0 : _a.sessionData)) {
            app.$plugins.get('JovoUser').config.sessionData = {
                data: true,
                enabled: true,
            };
        }
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        this.use(new LindenbaumCore_1.LindenbaumCore());
        jovo_core_1.Jovo.prototype.$lindenbaumBot = undefined;
        jovo_core_1.Jovo.prototype.lindenbaumBot = function () {
            if (this.constructor.name !== Lindenbaum.appType) {
                throw new jovo_core_1.JovoError(`Can't handle request. Please use this.isLindenbaumBot()`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-lindenbaum');
            }
            return this;
        };
    }
    async initialize(handleRequest) {
        var _a;
        handleRequest.platformClazz = Lindenbaum;
        await this.middleware('$init').run(handleRequest);
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== Lindenbaum.appType) {
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
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== Lindenbaum.appType) {
            return Promise.resolve();
        }
        if (handleRequest.jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            await this.middleware('$nlu').run(handleRequest.jovo);
            await this.middleware('$inputs').run(handleRequest.jovo);
        }
    }
    async tts(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== Lindenbaum.appType) {
            return Promise.resolve();
        }
        await this.middleware('$tts').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== Lindenbaum.appType) {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== Lindenbaum.appType) {
            return Promise.resolve();
        }
        const lindenbaumBot = handleRequest.jovo;
        await this.middleware('$response').run(lindenbaumBot);
        const baseUrl = lindenbaumBot.$request.getCallbackUrl();
        const $response = lindenbaumBot.$response;
        if (baseUrl) {
            $response.responses.forEach(async (res) => {
                const endpoint = Object.keys(res)[0]; // object only has one key
                await jovo_core_1.HttpService.post(baseUrl + endpoint, res[endpoint]);
            });
        }
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(new LindenbaumRequestBuilder_1.LindenbaumRequestBuilder(), new LindenbaumResponseBuilder_1.LindenbaumResponseBuilder());
    }
}
exports.Lindenbaum = Lindenbaum;
Lindenbaum.type = 'Lindenbaum';
Lindenbaum.appType = 'LindenbaumBot';
//# sourceMappingURL=Lindenbaum.js.map