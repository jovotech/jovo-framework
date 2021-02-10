"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const querystring_1 = require("querystring");
const _merge = require("lodash.merge");
const TARGET_SAMPLE_RATE = 16000;
class AzureAsr {
    constructor(config) {
        this.config = {
            endpointKey: '',
            endpointRegion: '',
            language: 'en-US',
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
        if (!parent.supportsASR()) {
            throw new jovo_core_1.JovoError(`'${this.name}' can only be used by platforms that support ASR!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        parent.middleware('$asr').use(this.asr.bind(this));
    }
    async asr(jovo) {
        const text = jovo.getRawText();
        const audio = jovo.getAudioData();
        if (audio) {
            const downSampled = jovo_core_1.AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
            const wavBuffer = jovo_core_1.AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);
            const result = await this.speechToText(wavBuffer, `audio/wav; codecs=audio/pcm; samplerate=${TARGET_SAMPLE_RATE}`);
            jovo.$asr = {
                text: result.DisplayText || '',
                [this.name]: result,
            };
        }
        else if (!text && jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No audio input.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
    }
    async speechToText(speech, contentType) {
        this.validateConfig();
        const path = `/speech/recognition/conversation/cognitiveservices/v1?${querystring_1.stringify({
            language: this.config.language,
        })}`;
        const url = `https://${this.config.endpointRegion}.stt.speech.microsoft.com${path}`;
        const config = {
            url,
            data: speech,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': this.config.endpointKey,
                'Content-type': contentType,
            },
            validateStatus: (status) => {
                return true;
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            if (response.status === 200 && response.data) {
                return response.data;
            }
            throw new jovo_core_1.JovoError(`Could not retrieve ASR data!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            const configText = `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`;
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details ? `${e.details}\n${configText}` : configText, e.hint, e.seeMore);
        }
    }
    validateConfig() {
        if (!this.config.endpointRegion || !this.config.endpointKey || !this.config.language) {
            throw new jovo_core_1.JovoError(`Invalid configuration!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`, `Make sure 'endpointRegion', 'endpointKey' and 'language' are set and valid.`);
        }
    }
}
exports.AzureAsr = AzureAsr;
//# sourceMappingURL=AzureAsr.js.map