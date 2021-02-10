"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = require("aws-sdk/clients/all");
const jovo_core_1 = require("jovo-core");
require("./");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
class PollyTts {
    constructor(config) {
        this.config = {
            credentials: {
                region: process.env.AWS_REGION || 'us-east-1',
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            languageCode: undefined,
            lexiconNames: undefined,
            outputFormat: 'mp3',
            sampleRate: 16000,
            speechMarkTypes: undefined,
            voiceId: 'Matthew',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    get name() {
        return this.constructor.name;
    }
    install(parent) {
        this.validateConfig();
        this.$polly = new all_1.Polly({
            credentials: this.config.credentials,
            region: this.config.credentials.region,
        });
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
                    const pollyResult = await this.textToSpeech(jovo_core_1.SpeechBuilder.toSSML(part));
                    if (pollyResult) {
                        results.push(this.getAudioTagFromPollyResult(pollyResult));
                    }
                }
            }
            results.forEach((result) => {
                output += result;
            });
        }
        else {
            const pollyResult = await this.textToSpeech(jovo_core_1.SpeechBuilder.toSSML(text));
            if (pollyResult) {
                output = this.getAudioTagFromPollyResult(pollyResult);
            }
        }
        output = jovo_core_1.SpeechBuilder.toSSML(output);
        _set(jovo.$output, path, output);
        _set(jovo.$output, path + 'Text', jovo_core_1.SpeechBuilder.removeSSML(text));
    }
    getAudioTagFromPollyResult(pollyResult) {
        if (pollyResult.AudioStream) {
            const value = pollyResult.AudioStream.toString('base64');
            return new jovo_core_1.SpeechBuilder().addAudio(value).toString();
        }
        return '';
    }
    textToSpeech(ssml) {
        return new Promise((resolve, reject) => {
            const params = {
                LexiconNames: this.config.lexiconNames || [],
                OutputFormat: this.config.outputFormat || 'mp3',
                SampleRate: String(this.config.sampleRate) || '16000',
                SpeechMarkTypes: this.config.speechMarkTypes || [],
                Text: ssml,
                TextType: 'ssml',
                VoiceId: this.config.voiceId || 'Matthew',
            };
            if (this.config.languageCode) {
                params.LanguageCode = this.config.languageCode;
            }
            this.$polly.synthesizeSpeech(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
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
exports.PollyTts = PollyTts;
//# sourceMappingURL=PollyTts.js.map