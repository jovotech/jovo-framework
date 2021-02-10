"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = __importDefault(require("lodash.get"));
class BixbyRequest {
    constructor() {
        this.sessionData = {};
        this.inputs = {};
    }
    toJSON() {
        return Object.assign({}, this);
    }
    static fromJSON(json, query) {
        const bixbyJson = typeof json === 'string' ? JSON.parse(json) : json;
        const request = new BixbyRequest();
        for (const [key, val] of Object.entries(bixbyJson)) {
            switch (key) {
                case '$vivContext':
                    request.vivContext = val;
                    break;
                case '_JOVO_PREV_RESPONSE_':
                    request.sessionData = lodash_get_1.default(bixbyJson, `${key}._JOVO_SESSION_DATA_`, {});
                    break;
                default: {
                    const inputKey = '_JOVO_INPUT_';
                    if (key.includes(inputKey)) {
                        const newKey = key.slice(inputKey.length);
                        request.inputs[newKey] = val;
                    }
                }
            }
        }
        request.intent = lodash_get_1.default(query, 'intent', 'LAUNCH');
        request.directive = lodash_get_1.default(query, 'directive');
        return request;
    }
    getSessionAttributes() {
        return this.sessionData;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    getDeviceName() {
        return this.vivContext.device;
    }
    getUserId() {
        return this.vivContext.bixbyUserId;
    }
    getAccessToken() {
        return undefined;
    }
    getLocale() {
        return this.vivContext.locale;
    }
    getLanguage() {
        return this.getLocale();
    }
    isNewSession() {
        return Object.keys(this.sessionData).length === 0;
    }
    getTimestamp() {
        return '';
    }
    hasAudioInterface() {
        return true;
    }
    hasScreenInterface() {
        return true;
    }
    hasVideoInterface() {
        return false;
    }
    getSessionId() {
        return this.sessionData._JOVO_SESSION_ID_ || this.vivContext.sessionId;
    }
    getInputs() {
        // parse every input into key,value, ...
        const inputs = {};
        for (const [key, val] of Object.entries(this.inputs)) {
            inputs[key] = {
                key: val,
                value: val,
            };
        }
        return inputs;
    }
    setInputs(inputs) {
        for (const key of Object.keys(inputs)) {
            const input = inputs[key];
            this.inputs[key] = input.key;
        }
        return this;
    }
    getState() {
        const sessionData = this.getSessionAttributes();
        return sessionData._JOVO_STATE_;
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    setSessionAttributes(sessionData) {
        if (this.getSessionAttributes()) {
            for (const key of Object.keys(sessionData)) {
                this.sessionData[key] = sessionData[key];
            }
        }
        return this;
    }
    // tslint:disable:no-any
    addSessionAttribute(key, value) {
        if (this.getSessionAttributes()) {
            this.sessionData[key] = value;
        }
        return this;
    }
    // tslint:disable:no-any
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    addInput(key, value) {
        this.inputs[key] = value;
        return this;
    }
    setTimestamp(timestamp) {
        // TODO implement
        return this;
    }
    setLocale(locale) {
        // TODO implement
        return this;
    }
    setUserId(userId) {
        // TODO possible
        return this;
    }
    setAccessToken(accessToken) {
        // TODO necessary?
        return this;
    }
    setNewSession(isNew) {
        // TODO reset session id and session data?
        if (isNew) {
            this.sessionData = {
                _JOVO_SESSION_ID_: this.getSessionId(),
            };
        }
        return this;
    }
    setAudioInterface() {
        // TODO implement
        return this;
    }
    setScreenInterface() {
        // TODO implement
        return this;
    }
    setVideoInterface() {
        // TODO implement
        return this;
    }
    setState(state) {
        this.sessionData._JOVO_STATE_ = state;
        return this;
    }
    getIntentName() {
        return this.intent;
    }
    setIntentName(intentName) {
        this.intent = intentName;
        return this;
    }
}
exports.BixbyRequest = BixbyRequest;
//# sourceMappingURL=BixbyRequest.js.map