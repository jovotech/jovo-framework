import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');

import {
    BaseApp,
    Extensible,
    Platform,
    TestSuite,
    HandleRequest, ActionSet, ExtensibleConfig, Jovo, EnumRequestType
} from "jovo-core";
import {AlexaSkill} from "./core/AlexaSkill";
import {AlexaTestSuite} from "./core/Interfaces";
import {AlexaCore} from "./modules/AlexaCore";
import {AudioPlayerPlugin} from "./modules/AudioPlayerPlugin";
import {CanFulfillIntent} from "./modules/CanFulfillIntent";
import {Display} from "./modules/Display";
import {GameEnginePlugin} from "./modules/GameEnginePlugin";
import {HouseholdListEvent} from "./modules/HouseholdListEvent";
import {InSkillPurchasePlugin} from "./modules/InSkillPurchasePlugin";
import {PlaybackController} from "./modules/PlaybackController";
import {SkillEvent} from "./modules/SkillEvent";
import {Cards} from "./modules/Cards";
import {DialogInterface} from "./modules/DialogInterface";
import {AlexaNLU} from "./modules/AlexaNLU";
import {AlexaRequestBuilder} from './core/AlexaRequestBuilder';
import {AlexaResponseBuilder} from "./core/AlexaResponseBuilder";
import {GadgetControllerPlugin} from "./modules/GadgetControllerPlugin";
import {ProactiveEventPlugin} from './modules/ProactiveEvent';

export interface Config extends ExtensibleConfig {
    allowedSkillIds: string[];
    defaultResponseOnFail: boolean;
    handlers?: any; //tslint:disable-line
}

export class Alexa extends Extensible implements Platform {

    requestBuilder = new AlexaRequestBuilder();
    responseBuilder = new AlexaResponseBuilder();

    config: Config = {
        enabled: true,
        allowedSkillIds: [],
        defaultResponseOnFail: false,
        plugin: {},
        handlers: undefined,
    };

    constructor(config?: Config) {
        super(config);

        if (config) {
            this.config = _merge(this.config, config);
        }

        this.actionSet = new ActionSet([
            '$init',
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

    getAppType(): string {
        return 'AlexaSkill';
    }


    install(app: BaseApp) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('platform.init')!.use(this.initialize.bind(this));
        app.middleware('platform.nlu')!.use(this.nlu.bind(this));
        app.middleware('platform.output')!.use(this.output.bind(this));
        app.middleware('response')!.use(this.response.bind(this));


        app.middleware('fail')!.use((handleRequest: HandleRequest) => {
            if (!handleRequest.jovo) {
                return;
            }

            if (this.config.defaultResponseOnFail) {
                if (!_get(handleRequest.jovo.$handlers, EnumRequestType.ON_ERROR)) {
                    app.middleware('response')!.run(handleRequest);
                }
            }
        });


        this.use(
            new AlexaCore(),
            new AlexaNLU(),
            new AudioPlayerPlugin(),
            new CanFulfillIntent(),
            new Display(),
            new GameEnginePlugin(),
            new HouseholdListEvent(),
            new InSkillPurchasePlugin(),
            new GadgetControllerPlugin(),
            new PlaybackController(),
            new SkillEvent(),
            new Cards(),
            new DialogInterface(),
            new ProactiveEventPlugin()
        );

        Jovo.prototype.$alexaSkill = undefined;
        Jovo.prototype.alexaSkill = function() {
            if (this.constructor.name !== 'AlexaSkill'  ) {
                throw Error(`Can't handle request. Please use this.isAlexaSkill()`);
            }
            return this as AlexaSkill;
        };
        Jovo.prototype.isAlexaSkill = function() {
            return this.constructor.name === 'AlexaSkill';
        };

        BaseApp.prototype.setAlexaHandler = function(...handlers: any[]) { // tslint:disable-line
            for (const obj of handlers) { // eslint-disable-line
                if (typeof obj !== 'object') {
                    throw new Error('Handler must be of type object.');
                }
                const sourceHandler = _get(this.config.plugin,'Alexa.handlers');
                _set(this.config.plugin, 'Alexa.handlers', _merge(sourceHandler,obj));
            }
            return this;
        };

    }

    makeTestSuite(): AlexaTestSuite {
        return new TestSuite(new AlexaRequestBuilder(), new AlexaResponseBuilder());
    }


    async initialize(handleRequest: HandleRequest) {
        handleRequest.platformClazz = AlexaSkill;
        await this.middleware('$init')!.run(handleRequest);

        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$request')!.run(handleRequest.jovo);
        await this.middleware('$type')!.run(handleRequest.jovo);
        await this.middleware('$session')!.run(handleRequest.jovo);


        if (this.config.handlers) {
             _set(handleRequest.app, 'config.handlers', _merge( _get(handleRequest.app, 'config.handlers'), this.config.handlers));
        }
    }


    async nlu(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$nlu')!.run(handleRequest.jovo);
        await this.middleware('$inputs')!.run(handleRequest.jovo);

    }

    async output(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$output')!.run(handleRequest.jovo);
    }
    async response(handleRequest: HandleRequest) {
        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'AlexaSkill') {
            return Promise.resolve();
        }
        await this.middleware('$response')!.run(handleRequest.jovo);

        handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson ?
            this.responseBuilder.create(handleRequest.jovo.$rawResponseJson) : handleRequest.jovo.$response;
        await handleRequest.host.setResponse(handleRequest.jovo.$response);
    }
    uninstall(app: BaseApp) {

    }
}
