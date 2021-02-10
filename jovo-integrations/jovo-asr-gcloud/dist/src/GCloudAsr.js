"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const google_auth_library_1 = require("google-auth-library");
const jovo_core_1 = require("jovo-core");
const util_1 = require("util");
const _merge = require("lodash.merge");
const readFile = util_1.promisify(fs.readFile);
const TARGET_SAMPLE_RATE = 16000;
class GCloudAsr {
    constructor(config) {
        this.config = {
            credentialsFile: './credentials.json',
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
        if (!parent.supportsASR()) {
            throw new jovo_core_1.JovoError(`'${this.name}' can only be used by platforms that support ASR!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        parent.middleware('setup').use(this.setup.bind(this));
        parent.middleware('$asr').use(this.asr.bind(this));
    }
    async setup(handleRequest) {
        const jwtClient = await this.initializeJWT();
        if (jwtClient) {
            await jwtClient.authorize();
            this.jwtClient = jwtClient;
        }
    }
    async asr(jovo) {
        const text = jovo.getRawText();
        const audio = jovo.getAudioData();
        if (audio) {
            const downSampled = jovo_core_1.AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
            const wavBuffer = jovo_core_1.AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);
            const locale = jovo.$request.getLocale() || this.config.locale;
            const result = await this.speechToText(wavBuffer, locale);
            jovo.$asr = {
                text: result.results[0].alternatives[0].transcript,
                [this.name]: result,
            };
        }
        else if (!text && jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No audio input.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
    }
    async speechToText(speech, locale) {
        var _a;
        const url = `https://speech.googleapis.com/v1/speech:recognize`;
        const accessTokenObj = await ((_a = this.jwtClient) === null || _a === void 0 ? void 0 : _a.getAccessToken());
        const authToken = accessTokenObj ? accessTokenObj.token : '';
        const reqData = {
            config: {
                languageCode: locale,
            },
            audio: {
                content: speech.toString('base64'),
            },
        };
        const config = {
            url,
            data: reqData,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            if (response.status === 200 && response.data) {
                if (response.data.results.length === 0 ||
                    (response.data.results.length > 0 && response.data.results[0].alternatives.length === 0)) {
                    throw new jovo_core_1.JovoError(`Could not retrieve ASR data: No text could be extracted!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
                }
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
exports.GCloudAsr = GCloudAsr;
//# sourceMappingURL=GCloudAsr.js.map