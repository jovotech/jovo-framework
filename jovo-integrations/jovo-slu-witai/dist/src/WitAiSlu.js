"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const BASE_URL = `https://api.wit.ai`;
const TARGET_SAMPLE_RATE = 8000;
class WitAiSlu {
    constructor(config) {
        this.config = {
            token: '',
            minConfidence: 0,
            asr: {
                enabled: true,
            },
            nlu: {
                enabled: true,
            },
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
        if (parent.supportsASR()) {
            parent.middleware('$asr').use(this.asr.bind(this));
        }
        parent.middleware('$nlu').use(this.nlu.bind(this));
        parent.middleware('$inputs').use(this.inputs.bind(this));
    }
    async asr(jovo) {
        var _a;
        if (((_a = this.config.asr) === null || _a === void 0 ? void 0 : _a.enabled) === false) {
            return;
        }
        const text = jovo.getRawText();
        const audio = jovo.getAudioData();
        if (audio) {
            const downSampled = jovo_core_1.AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
            const wavBuffer = jovo_core_1.AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);
            const result = await this.speechToText(wavBuffer, 'audio/wav');
            jovo.$asr = {
                text: result._text || '',
                [this.name]: result,
            };
        }
        else if (!text && jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No audio or text input.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
    }
    async nlu(jovo) {
        var _a;
        if (((_a = this.config.nlu) === null || _a === void 0 ? void 0 : _a.enabled) === false) {
            return;
        }
        const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();
        let response = null;
        if (text) {
            response = await this.naturalLanguageProcessing(text);
        }
        else if (jovo.$asr && jovo.$asr[this.name] && !jovo.$asr[this.name].error) {
            response = jovo.$asr[this.name];
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No audio or text input to process.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        let intentName = 'DefaultFallbackIntent';
        response = response;
        if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        else if (response.entities.intent && response.entities.intent.length >= 0) {
            let biggestIndex = 0;
            response.entities.intent.forEach((intent, index) => {
                if (intent.confidence > response.entities.intent[biggestIndex].confidence) {
                    biggestIndex = index;
                }
            });
            if (response.entities.intent[biggestIndex].confidence >= this.config.minConfidence) {
                intentName = response.entities.intent[biggestIndex].value;
            }
        }
        jovo.$nlu = {
            intent: {
                name: intentName,
            },
            [this.name]: response,
        };
    }
    async inputs(jovo) {
        var _a;
        if (((_a = this.config.nlu) === null || _a === void 0 ? void 0 : _a.enabled) === false) {
            return;
        }
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
        for (const entityName in response.entities) {
            if (entityName !== 'intent' && Array.isArray(response.entities[entityName])) {
                response.entities[entityName].forEach((foundEntity) => {
                    // TODO implement handling for arrays of the same entity.
                    inputs[entityName] = {
                        name: entityName,
                        key: entityName,
                        value: foundEntity.value,
                    };
                });
            }
        }
        jovo.$inputs = inputs;
    }
    async speechToText(speech, contentType) {
        this.validateConfig();
        const url = `${BASE_URL}/speech`;
        const config = {
            url,
            method: 'POST',
            data: speech,
            headers: {
                'Authorization': `Bearer ${this.config.token}`,
                'Content-Length': speech.byteLength,
                'Content-Type': contentType,
            },
            validateStatus: (status) => {
                return true;
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            if (response.status === 200 && response.data && response.data.msg_id) {
                return response.data;
            }
            throw new jovo_core_1.JovoError(`Could not retrieve ASR data!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            const configText = `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`;
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details ? `${e.details}\n${configText}` : configText, e.hint, e.seeMore);
        }
    }
    async naturalLanguageProcessing(text) {
        this.validateConfig();
        const query = encodeURIComponent(text);
        const url = `${BASE_URL}/message?q=${query}`;
        const config = {
            url,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.config.token}`,
            },
            validateStatus: (status) => {
                return true;
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            if (response.status === 200 && response.data && response.data.msg_id) {
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
        if (!this.config.token) {
            throw new jovo_core_1.JovoError(`Invalid configuration!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`, `Make sure 'token' is set and valid`);
        }
    }
}
exports.WitAiSlu = WitAiSlu;
//# sourceMappingURL=WitAiSlu.js.map