"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
class RasaNlu {
    constructor(config) {
        this.config = {
            endpoint: 'http://localhost:5000/parse',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    get name() {
        return this.constructor.name;
    }
    install(parent) {
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
        let intentName = '';
        if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        else if (response && response.intent) {
            intentName = response.intent.name;
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
        const entities = response.entities;
        if (!entities) {
            return inputs;
        }
        entities.forEach((entity) => {
            inputs[entity.entity] = {
                key: entity.value,
                name: entity.entity,
                value: entity.value,
            };
        });
        jovo.$inputs = inputs;
    }
    async naturalLanguageProcessing(text) {
        this.validateConfig();
        const url = `${this.config.endpoint}/model/parse`;
        const options = {
            url,
            method: 'post',
            validateStatus: (status) => {
                return true;
            },
            data: {
                text,
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
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details, e.hint, e.seeMore);
        }
    }
    validateConfig() {
        if (!this.config.endpoint) {
            throw new jovo_core_1.JovoError(`Invalid configuration!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`, `Make sure 'endpoint' is set and valid.`);
        }
    }
}
exports.RasaNlu = RasaNlu;
//# sourceMappingURL=RasaNlu.js.map