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
const exists = util_1.promisify(fs.exists);
const BASE_URL = 'https://dialogflow.googleapis.com';
class DialogflowNlu {
    constructor(config) {
        this.config = {
            defaultIntent: 'Default Fallback Intent',
            defaultLocale: 'en-US',
            minConfidence: 0,
            credentialsFile: './credentials.json',
            authToken: '',
            projectId: '',
            requireCredentialsFile: true,
            getSessionIdCallback: undefined,
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
        parent.middleware('setup').use(this.setup.bind(this));
        parent.middleware('after.$init').use(this.afterInit.bind(this));
        parent.middleware('$nlu').use(this.nlu.bind(this));
        parent.middleware('$inputs').use(this.inputs.bind(this));
        this.parentName = parent.name || parent.constructor.name;
    }
    async setup(handleRequest) {
        const jwtClient = await this.initializeJWT();
        if (jwtClient) {
            await jwtClient.authorize();
            this.jwtClient = jwtClient;
        }
    }
    async afterInit(handleRequest) {
        if (handleRequest.jovo) {
            let authToken = '';
            if (this.jwtClient) {
                const accessTokenObj = await this.jwtClient.getAccessToken();
                if (accessTokenObj.token) {
                    authToken = accessTokenObj.token;
                }
            }
            const projectId = this.jwtClient ? this.jwtClient.projectId : '';
            _set(handleRequest.jovo.$config, `plugin.${this.parentName}.plugin.DialogflowNlu.authToken`, authToken);
            _set(handleRequest.jovo.$config, `plugin.${this.parentName}.plugin.DialogflowNlu.projectId`, projectId);
        }
    }
    async nlu(jovo) {
        var _a, _b;
        const text = ((_a = jovo.$asr) === null || _a === void 0 ? void 0 : _a.text) || jovo.getRawText();
        let response = null;
        if (text) {
            const languageCode = ((_b = jovo.$request) === null || _b === void 0 ? void 0 : _b.getLocale()) || this.config.defaultLocale;
            response = await this.naturalLanguageProcessing(jovo, {
                text,
                languageCode,
            });
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No text input to process.', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name);
        }
        const minConfidence = this.config.minConfidence || 0;
        let intentName = this.config.defaultIntent || 'DefaultFallbackIntent';
        if (jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (jovo.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        else if (response && response.queryResult.intentDetectionConfidence >= minConfidence) {
            intentName = response.queryResult.intent.displayName;
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
        const parameters = response.queryResult.parameters;
        if (!parameters) {
            return inputs;
        }
        Object.keys(parameters).forEach((entityName) => {
            const entityData = parameters[entityName];
            // TODO make sure this is intended
            const value = typeof entityData === 'string' ? entityData : entityData.toString();
            inputs[entityName] = {
                key: value,
                name: entityName,
                value,
            };
        });
        jovo.$inputs = inputs;
    }
    async initializeJWT() {
        if (!this.config.credentialsFile) {
            if (this.config.requireCredentialsFile === false) {
                return;
            }
            else {
                throw new jovo_core_1.JovoError('Invalid configuration: Credentials file is not set!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, 'Credentials file is mandatory', `Make sure 'credentialsFile' is set.`);
            }
        }
        const fileExists = await exists(this.config.credentialsFile);
        if (!fileExists) {
            if (this.config.requireCredentialsFile === false) {
                return;
            }
            else {
                throw new jovo_core_1.JovoError('Invalid configuration: Credentials file does not exist!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Credentials file does not exist in '${this.config.credentialsFile}'`, `Make sure 'credentialsFile' points to a valid GCloud credentials file.`);
            }
        }
        const results = await readFile(this.config.credentialsFile);
        const keyFileObject = JSON.parse(results.toString());
        const jwtClient = new google_auth_library_1.JWT(keyFileObject.client_email, undefined, keyFileObject.private_key, ['https://www.googleapis.com/auth/dialogflow'], undefined);
        jwtClient.projectId = keyFileObject.project_id;
        return jwtClient;
    }
    async naturalLanguageProcessing(jovo, textInput) {
        var _a;
        const sessionId = this.config.getSessionIdCallback
            ? await this.config.getSessionIdCallback(jovo)
            : ((_a = jovo.$request) === null || _a === void 0 ? void 0 : _a.getSessionId()) || jovo.$user.getId();
        const authToken = _get(jovo.$config, `plugin.${this.parentName}.plugin.DialogflowNlu.authToken`, '');
        const projectId = _get(jovo.$config, `plugin.${this.parentName}.plugin.DialogflowNlu.projectId`, '');
        if (!authToken || !projectId || !sessionId) {
            let reasons = 'Reasons:';
            const addToReasonsIfNotValid = (val, text) => {
                if (!val) {
                    reasons += `\n${text}`;
                }
            };
            addToReasonsIfNotValid(projectId, 'No valid project-id was given.');
            addToReasonsIfNotValid(sessionId, 'No valid session-id was given.');
            addToReasonsIfNotValid(authToken, 'No authentication-token was provided.');
            throw new jovo_core_1.JovoError(`Can not access Dialogflow-API!`, jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, reasons);
        }
        const path = `/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        };
        const data = {
            queryInput: {
                text: textInput,
            },
        };
        const config = {
            baseURL: BASE_URL,
            url: path,
            data,
            method: 'POST',
            headers,
            validateStatus: (status) => {
                return true;
            },
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            if (response.status === 200 && response.data) {
                return response.data;
            }
            throw new jovo_core_1.JovoError('Could not retrieve NLU data!', jovo_core_1.ErrorCode.ERR_PLUGIN, this.name, `Response: ${response.status} ${response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'}`);
        }
        catch (e) {
            throw new jovo_core_1.JovoError(e.message || e, jovo_core_1.ErrorCode.ERR_PLUGIN, e.module || this.name, e.details, e.hint, e.seeMore);
        }
    }
}
exports.DialogflowNlu = DialogflowNlu;
//# sourceMappingURL=DialogflowNlu.js.map