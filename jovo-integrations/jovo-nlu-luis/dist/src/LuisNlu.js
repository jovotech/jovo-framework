"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const querystring = require("querystring");
const _merge = require("lodash.merge");
class LuisNlu {
    constructor(config) {
        this.config = {
            endpointKey: '',
            endpointRegion: '',
            appId: '',
            verbose: false,
            slot: 'staging',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    get name() {
        return this.constructor.name;
    }
    install(parent) {
        if (!(parent instanceof jovo_core_1.Platform)) {
            throw new jovo_core_1.JovoError(`'${this.name}' has to be an immediate plugin of a platform!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        parent.middleware('$nlu').use(this.nlu.bind(this));
        parent.middleware('$inputs').use(this.inputs.bind(this));
    }
    async nlu(jovo) {
        const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();
        let response = null;
        if (text) {
            response = await this.naturalLanguageProcessing(text);
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No text input to process.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        let intentName = this.config.defaultIntent || 'None';
        if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        else if (response && response.prediction && response.prediction.topIntent) {
            intentName = response.prediction.topIntent;
        }
        jovo.$nlu = {
            intent: {
                name: intentName,
            },
            [this.name]: response,
        };
    }
    async inputs(jovo) {
        if ((!jovo.$nlu || !jovo.$nlu[this.name]) && jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No nlu data to get inputs off was given.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH ||
            jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            jovo.$inputs = {};
            return;
        }
        const response = jovo.$nlu[this.name];
        const inputs = {};
        const entities = response.prediction.entities;
        if (!entities) {
            return inputs;
        }
        for (const entityName in entities) {
            if (entities.hasOwnProperty(entityName)) {
                const entityData = entities[entityName];
                const value = typeof entityData === 'string' ? entityData : entityData.toString();
                inputs[entityName] = {
                    key: value,
                    name: entityName,
                    value,
                };
            }
        }
        jovo.$inputs = inputs;
    }
    async naturalLanguageProcessing(text) {
        this.validateConfig();
        const queryParams = {
            'show-all-intents': true,
            'verbose': this.config.verbose || false,
            'query': text,
            'subscription-key': this.config.endpointKey,
        };
        const path = `/luis/prediction/v3.0/apps/${this.config.appId}/slots/${this.config.slot}/predict?${querystring.stringify(queryParams)}`;
        const url = `https://${this.config.endpointRegion}.api.cognitive.microsoft.com${path}`;
        const options = {
            url,
            validateStatus: (status) => {
                return true;
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(options);
            if (response.status === 200 && response.data) {
                return response.data;
            }
            throw new jovo_core_1.JovoError(`Could not retrieve NLU data!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            const configText = `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`;
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details ? `${e.details}\n${configText}` : configText, e.hint, e.seeMore);
        }
    }
    validateConfig() {
        if (!this.config.endpointKey ||
            !this.config.endpointRegion ||
            !this.config.appId ||
            !this.config.slot) {
            throw new jovo_core_1.JovoError(`Invalid configuration!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`, `Make sure 'endpointRegion', 'endpointKey', 'appId' and 'slot' are set and valid.`);
        }
    }
}
exports.LuisNlu = LuisNlu;
//# sourceMappingURL=LuisNlu.js.map