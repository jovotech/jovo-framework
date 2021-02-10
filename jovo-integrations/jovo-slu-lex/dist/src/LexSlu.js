"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = require("aws-sdk/clients/all");
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const TARGET_SAMPLE_RATE = 16000;
class LexSlu {
    constructor(config) {
        this.config = {
            botAlias: '',
            botName: '',
            credentials: {
                region: process.env.AWS_REGION || 'us-east-1',
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            defaultIntent: 'DefaultFallbackIntent',
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
        this.validateConfig();
        this.$lex = new all_1.LexRuntime({
            credentials: this.config.credentials,
            region: this.config.credentials.region,
        });
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
            const result = await this.speechToText(jovo.$user.getId(), wavBuffer);
            jovo.$asr = {
                text: result.inputTranscript || '',
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
            response = await this.naturalLanguageProcessing(jovo.$user.getId(), text);
        }
        else if (jovo.$asr && jovo.$asr[this.name] && !jovo.$asr[this.name].error) {
            response = jovo.$asr[this.name];
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No audio or text input to process.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        let intentName = 'DefaultFallbackIntent';
        if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        else if (response && response.intentName && response.dialogState) {
            intentName = response.intentName;
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
        const slots = response.slots;
        if (!slots) {
            return inputs;
        }
        Object.keys(slots).forEach((slot) => {
            inputs[slot] = {
                key: slots[slot],
                name: slot,
                value: slots[slot],
            };
        });
        jovo.$inputs = inputs;
    }
    speechToText(userId, speech) {
        const params = {
            botAlias: this.config.botAlias || '',
            botName: this.config.botName || '',
            contentType: 'audio/x-l16; sample-rate=16000; channel-count=1',
            inputStream: speech,
            userId,
            accept: 'text/plain; charset=utf-8',
        };
        try {
            return this.$lex.postContent(params).promise();
        }
        catch (e) {
            throw new jovo_core_1.JovoError(`Could not retrieve ASR data!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, e);
        }
    }
    naturalLanguageProcessing(userId, text) {
        const params = {
            botAlias: this.config.botAlias || '',
            botName: this.config.botName || '',
            userId,
            inputText: text,
        };
        try {
            return this.$lex.postText(params).promise();
        }
        catch (e) {
            throw new jovo_core_1.JovoError(`Could not retrieve NLU data!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, e);
        }
    }
    validateConfig() {
        var _a, _b, _c;
        if (!((_a = this.config.credentials) === null || _a === void 0 ? void 0 : _a.region) ||
            !((_b = this.config.credentials) === null || _b === void 0 ? void 0 : _b.accessKeyId) ||
            !((_c = this.config.credentials) === null || _c === void 0 ? void 0 : _c.secretAccessKey)) {
            throw new jovo_core_1.JovoError(`Invalid configuration!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`, `Make sure 'credentials.region', 'credentials.accessKeyId' and 'credentials.secretAccessKey' are set and valid.`);
        }
    }
}
exports.LexSlu = LexSlu;
//# sourceMappingURL=LexSlu.js.map