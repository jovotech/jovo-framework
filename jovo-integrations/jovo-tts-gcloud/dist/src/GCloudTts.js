"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const google_auth_library_1 = require("google-auth-library");
const jovo_core_1 = require("jovo-core");
const util_1 = require("util");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const readFile = util_1.promisify(fs.readFile);
class GCloudTts {
    constructor(config) {
        this.config = {
            credentialsFile: './credentials.json',
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
        parent.middleware('setup').use(this.setup.bind(this));
        parent.middleware('$tts').use(this.tts.bind(this));
    }
    async setup(handleRequest) {
        const jwtClient = await this.initializeJWT();
        if (jwtClient) {
            await jwtClient.authorize();
            this.jwtClient = jwtClient;
        }
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
    getAudioTagFromResult(result) {
        return result.audioContent ? new jovo_core_1.SpeechBuilder().addAudio(result.audioContent).toString() : '';
    }
    async textToSpeech(ssml) {
        var _a;
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize`;
        const accessTokenObj = await ((_a = this.jwtClient) === null || _a === void 0 ? void 0 : _a.getAccessToken());
        const authToken = accessTokenObj ? accessTokenObj.token : '';
        const reqData = {
            input: { ssml },
            voice: {
                languageCode: 'en-US',
            },
            audioConfig: {
                audioEncoding: 'MP3',
            },
        };
        const config = {
            url,
            data: reqData,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`,
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
            throw new jovo_core_1.JovoError('Could not retrieve ASR data!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details, e.hint, e.seeMore);
        }
    }
    async initializeJWT() {
        if (!this.config.credentialsFile) {
            throw new jovo_core_1.JovoError('Invalid configuration: Credentials file is not set!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, 'Credentials file is mandatory', `Make sure 'credentialsFile' is set.`);
        }
        try {
            const keyData = await readFile(this.config.credentialsFile);
            const keyFileObject = JSON.parse(keyData.toString());
            const jwtClient = new google_auth_library_1.JWT(keyFileObject.client_email, undefined, keyFileObject.private_key, [
                'https://www.googleapis.com/auth/cloud-platform',
            ]);
            jwtClient.projectId = keyFileObject.project_id;
            return jwtClient;
        }
        catch (e) {
            throw new jovo_core_1.JovoError('Invalid configuration: Credentials file does not exist!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Credentials file does not exist in '${this.config.credentialsFile}'`, `Make sure 'credentialsFile' points to a valid GCloud credentials file.`);
        }
    }
}
exports.GCloudTts = GCloudTts;
//# sourceMappingURL=GCloudTts.js.map