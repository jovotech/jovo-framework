"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const _merge = require("lodash.merge");
const jovo_core_1 = require("jovo-core");
const AlexaSkill_1 = require("./core/AlexaSkill");
const AlexaCore_1 = require("./modules/AlexaCore");
const AudioPlayerPlugin_1 = require("./modules/AudioPlayerPlugin");
const CanFulfillIntent_1 = require("./modules/CanFulfillIntent");
const Display_1 = require("./modules/Display");
const GameEnginePlugin_1 = require("./modules/GameEnginePlugin");
const HouseholdListEvent_1 = require("./modules/HouseholdListEvent");
const InSkillPurchasePlugin_1 = require("./modules/InSkillPurchasePlugin");
const PlaybackController_1 = require("./modules/PlaybackController");
const SkillEvent_1 = require("./modules/SkillEvent");
const Cards_1 = require("./modules/Cards");
const DialogInterface_1 = require("./modules/DialogInterface");
const AlexaNlu_1 = require("./modules/AlexaNlu");
const AlexaRequestBuilder_1 = require("./core/AlexaRequestBuilder");
const AlexaResponseBuilder_1 = require("./core/AlexaResponseBuilder");
const GadgetControllerPlugin_1 = require("./modules/GadgetControllerPlugin");
const ProactiveEvent_1 = require("./modules/ProactiveEvent");
const AplPlugin_1 = require("./modules/AplPlugin");
const AskFor_1 = require("./modules/AskFor");
const AmazonPay_1 = require("./modules/AmazonPay");
class Alexa extends jovo_core_1.Platform {
    constructor(config) {
        super(config);
        this.requestBuilder = new AlexaRequestBuilder_1.AlexaRequestBuilder();
        this.responseBuilder = new AlexaResponseBuilder_1.AlexaResponseBuilder();
        this.config = {
            enabled: true,
            allowedSkillIds: [],
            defaultResponseOnFail: false,
            plugin: {},
            handlers: undefined,
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    getAppType() {
        return 'AlexaSkill';
    }
    install(app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('setup').use(this.setup.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('platform.nlu').use(this.nlu.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
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
        this.use(new AlexaCore_1.AlexaCore(), new AlexaNlu_1.AlexaNlu(), new AudioPlayerPlugin_1.AudioPlayerPlugin(), new CanFulfillIntent_1.CanFulfillIntent(), new Display_1.Display(), new AplPlugin_1.AplPlugin(), new GameEnginePlugin_1.GameEnginePlugin(), new HouseholdListEvent_1.HouseholdListEvent(), new InSkillPurchasePlugin_1.InSkillPurchasePlugin(), new GadgetControllerPlugin_1.GadgetControllerPlugin(), new PlaybackController_1.PlaybackController(), new SkillEvent_1.SkillEvent(), new Cards_1.Cards(), new DialogInterface_1.DialogInterface(), new ProactiveEvent_1.ProactiveEventPlugin(), new AskFor_1.AskFor(), new AmazonPay_1.AmazonPayPlugin());
        jovo_core_1.Jovo.prototype.$alexaSkill = undefined;
        jovo_core_1.Jovo.prototype.alexaSkill = function () {
            if (this.constructor.name !== 'AlexaSkill') {
                throw Error(`Can't handle request. Please use this.isAlexaSkill()`);
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isAlexaSkill = function () {
            return this.constructor.name === 'AlexaSkill';
        };
        // tslint:disable-next-line
        jovo_core_1.BaseApp.prototype.setAlexaHandler = function (...handlers) {
            for (const obj of handlers) {
                // eslint-disable-line
                if (typeof obj !== 'object') {
                    throw new Error('Handler must be of type object.');
                }
                const sourceHandler = _get(this.config.plugin, 'Alexa.handlers');
                _set(this.config, 'plugin.Alexa.handlers', _merge(sourceHandler, obj));
            }
            return this;
        };
    }
    makeTestSuite() {
        return new jovo_core_1.TestSuite(new AlexaRequestBuilder_1.AlexaRequestBuilder(), new AlexaResponseBuilder_1.AlexaResponseBuilder());
    }
    async initialize(handleRequest) {
        handleRequest.platformClazz = AlexaSkill_1.AlexaSkill;
        await this.middleware('$init').run(handleRequest);
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
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
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$nlu').run(handleRequest.jovo);
        await this.middleware('$inputs').run(handleRequest.jovo);
    }
    async tts(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$tts').run(handleRequest.jovo);
    }
    async output(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$output').run(handleRequest.jovo);
    }
    async response(handleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
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
exports.Alexa = Alexa;
//# sourceMappingURL=Alexa.js.map