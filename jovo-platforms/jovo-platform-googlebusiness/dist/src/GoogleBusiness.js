"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const GoogleBusinessRequestBuilder_1 = require("./core/GoogleBusinessRequestBuilder");
const GoogleBusinessResponseBuilder_1 = require("./core/GoogleBusinessResponseBuilder");
const Cards_1 = require("./modules/Cards");
const GoogleBusinessCore_1 = require("./modules/GoogleBusinessCore");
const GoogleBusinessAPI_1 = require("./services/GoogleBusinessAPI");
class GoogleBusiness extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.config = {
            locale: 'en',
            serviceAccount: undefined,
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
            '$nlu',
            '$inputs',
            '$tts',
            '$output',
            '$response',
        ], this);
    }
    getAppType() {
        return GoogleBusiness.appType;
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
        app.middleware('after.user.load').use(this.session.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        this.use(new GoogleBusinessCore_1.GoogleBusinessCore(), new Cards_1.Cards());
        jovo_core_1.Jovo.prototype.$googleBusinessBot = undefined;
        jovo_core_1.Jovo.prototype.googleBusinessBot = function () {
            if (this.constructor.name !== GoogleBusiness.appType) {
                throw new jovo_core_1.JovoError(`Can't handle request. Please use this.isGoogleBusinessBot()`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-googlebusiness');
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isGoogleBusinessBot = function () {
            return this.constructor.name === GoogleBusiness.appType;
        };
    }
    async initialize(handleRequest) {
        var _a;
        handleRequest.platformClazz = GoogleBusiness;
        await this.middleware('$init').run(handleRequest);
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== GoogleBusiness.appType) {
            return Promise.resolve();
        }
        await this.middleware('$request').run(handleRequest.jovo);
        await this.middleware('$type').run(handleRequest.jovo);
        if (this.config.handlers) {
            handleRequest.app.config.handlers = _merge(handleRequest.app.config.handlers, this.config.handlers);
        }
    }
    async nlu(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== GoogleBusiness.appType) {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async session(handleRequest) {
        var _a, _b, _c, _d, _e;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== GoogleBusiness.appType) {
            return Promise.resolve();
        }
        // check for duplicated messages and ignore the request if a message with the id was handled already
        const request = handleRequest.jovo.$request;
        const messageId = ((_b = request.message) === null || _b === void 0 ? void 0 : _b.messageId) || ((_e = (_d = (_c = request.suggestionResponse) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.match(/messages[/](.*)/)) === null || _e === void 0 ? void 0 : _e[1]) ||
            undefined;
        if (messageId) {
            const processedMessages = handleRequest.jovo.$session.$data.processedMessages || [];
            if (processedMessages.includes(messageId)) {
                handleRequest.stopMiddlewareExecution();
                return handleRequest.host.setResponse({});
            }
            else {
                processedMessages.push(messageId);
            }
            handleRequest.jovo.$session.$data.processedMessages = processedMessages;
            await handleRequest.jovo.$user.saveData();
        }
        await this.middleware('$session').run(handleRequest.jovo);
    }
    async tts(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== GoogleBusiness.appType) {
            return Promise.resolve();
        }
        await this.middleware('$tts').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        var _a;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== GoogleBusiness.appType) {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        var _a, _b;
        if (((_a = handleRequest.jovo) === null || _a === void 0 ? void 0 : _a.constructor.name) !== GoogleBusiness.appType) {
            return Promise.resolve();
        }
        await this.middleware('$response').run(handleRequest.jovo);
        const options = {
            data: handleRequest.jovo.$response.response,
            serviceAccount: this.config.serviceAccount,
            sessionId: ((_b = handleRequest.jovo.$request) === null || _b === void 0 ? void 0 : _b.getSessionId()) || '',
        };
        if (options.data.text ||
            options.data.richCard) {
            await GoogleBusinessAPI_1.GoogleBusinessAPI.sendResponse(options);
        }
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(new GoogleBusinessRequestBuilder_1.GoogleBusinessRequestBuilder(), new GoogleBusinessResponseBuilder_1.GoogleBusinessResponseBuilder());
    }
}
exports.GoogleBusiness = GoogleBusiness;
GoogleBusiness.type = 'GoogleBusiness';
GoogleBusiness.appType = 'GoogleBusinessBot';
//# sourceMappingURL=GoogleBusiness.js.map