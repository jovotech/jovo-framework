"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const TOKEN_EXPIRES_AFTER_IN_MINUTES = 9;
class AzureTts {
    constructor(config) {
        this.config = {
            endpointKey: '',
            endpointRegion: '',
            locale: 'en-US',
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
        if (!parent.supportsTTS()) {
            throw new jovo_core_1.JovoError(`'${this.name}' can only be used by platforms that support TTS!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        parent.middleware('$tts').use(this.tts.bind(this));
    }
    async tts(jovo) {
        await this.applyTTS(jovo, 'tell.speech');
        await this.applyTTS(jovo, 'ask.speech');
        await this.applyTTS(jovo, 'ask.reprompt');
    }
    async applyTTS(jovo, path) {
        const text = _get(jovo.$output, path);
        if (!text) {
            return;
        }
        let output = '';
        if (text.includes('<audio')) {
            const results = [];
            const splitParts = text.trim().split(/(<\s*audio[^>]*>(.*?)<\s*[/]\s*audio>)/);
            const parts = [];
            splitParts.forEach((splitPart) => {
                if (splitPart.length > 0) {
                    parts.push(splitPart);
                }
            });
            for (const part of parts) {
                if (part.startsWith('<audio')) {
                    results.push(part);
                }
                else {
                    const result = await this.textToSpeech(jovo_core_1.SpeechBuilder.toSSML(part));
                    results.push(this.getAudioTagFromResult(result));
                }
            }
            results.forEach((result) => {
                output += result;
            });
        }
        else {
            const result = await this.textToSpeech(jovo_core_1.SpeechBuilder.toSSML(text));
            output = this.getAudioTagFromResult(result);
        }
        output = jovo_core_1.SpeechBuilder.toSSML(output);
        _set(jovo.$output, path, output);
        _set(jovo.$output, path + 'Text', jovo_core_1.SpeechBuilder.removeSSML(text));
    }
    getAudioTagFromResult(buffer) {
        return buffer ? new jovo_core_1.SpeechBuilder().addAudio(buffer.toString('base64')).toString() : '';
    }
    async textToSpeech(ssml) {
        this.validateConfig();
        await this.updateTokenIfNecessary();
        const ssmlContent = jovo_core_1.SpeechBuilder.removeSpeakTags(ssml);
        ssml = `<speak version="1.0" xml:lang="${this.config.locale}"><voice xml:lang="${this.config.locale}" xml:gender="Female" name="en-US-JessaRUS">${ssmlContent}</voice></speak>`;
        const url = `https://${this.config.endpointRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
        const config = {
            url,
            data: ssml,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.currentToken ? this.currentToken.value : ''}`,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            },
            responseType: 'arraybuffer',
            validateStatus: (status) => {
                return true;
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            if (response.status === 200 && response.data) {
                return response.data;
            }
            throw new jovo_core_1.JovoError(`Could not retrieve TTS data!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            const configText = `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`;
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details ? `${e.details}\n${configText}` : configText, e.hint, e.seeMore);
        }
    }
    async updateTokenIfNecessary() {
        if (this.isTokenExpired()) {
            const token = await this.updateToken();
            this.currentToken = {
                value: token,
                expiresAt: new Date(Date.now() + TOKEN_EXPIRES_AFTER_IN_MINUTES * 60000),
            };
        }
    }
    isTokenExpired() {
        return this.currentToken ? Date.now() > this.currentToken.expiresAt.getTime() : true;
    }
    async updateToken() {
        const url = `https://${this.config.endpointRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
        const config = {
            url,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': this.config.endpointKey,
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
            throw new Error(`Could not retrieve token. status: ${response.status}, data: ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
    }
    validateConfig() {
        if (!this.config.endpointKey || !this.config.endpointRegion || !this.config.locale) {
            throw new jovo_core_1.JovoError(`Invalid configuration!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`, `Make sure 'endpointKey', 'endpointRegion' and 'locale' are set and valid.`);
        }
    }
}
exports.AzureTts = AzureTts;
//# sourceMappingURL=AzureTts.js.map