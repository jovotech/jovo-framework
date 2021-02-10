"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class LindenbaumRequest {
    constructor() {
        // the correct values will be parsed with fromJSON()
        this.dialogId = '';
        this.timestamp = 0;
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json);
        }
        else {
            const request = Object.create(LindenbaumRequest.prototype);
            return Object.assign(request, json);
        }
    }
    getCallbackUrl() {
        return this.callback;
    }
    getUserId() {
        return this.dialogId;
    }
    getRawText() {
        return this.text || '';
    }
    getTimestamp() {
        return new Date(this.timestamp * 1000).toISOString();
    }
    getDeviceName() {
        return undefined;
    }
    getAccessToken() {
        return undefined;
    }
    getLocale() {
        return this.language || '';
    }
    getSessionId() {
        return this.dialogId;
    }
    getMessageType() {
        return this.type;
    }
    getLocal() {
        return this.local;
    }
    getRemote() {
        return this.remote;
    }
    getInputs() {
        var _a;
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            return ((_a = this.nlu) === null || _a === void 0 ? void 0 : _a.inputs) || {};
        }
        else {
            jovo_core_1.Log.warn("Lindenbaum doesn't parse inputs in the request. Please use this.$inputs to get the inputs directly");
            return {};
        }
    }
    getSessionAttributes() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
        return {};
    }
    getSessionData() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
        return {};
    }
    getState() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.getState() instead.");
        return undefined;
    }
    getIntentName() {
        var _a;
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            return ((_a = this.nlu) === null || _a === void 0 ? void 0 : _a.intentName) || '';
        }
        else {
            jovo_core_1.Log.warn("Lindenbaum doesn't parse an intent in the request. Please use $lindenbaumBot.$nlu.intent.name to get the intent name");
            return '';
        }
    }
    isNewSession() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse a flag for new sessions in the request. Please use $lindenbaumBot.isNewSession() instead.");
        return false;
    }
    hasAudioInterface() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
        return true;
    }
    hasScreenInterface() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
        return false;
    }
    hasVideoInterface() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
        return false;
    }
    setTimestamp(timestamp) {
        this.timestamp = Math.floor(new Date(timestamp).getTime() / 1000);
        return this;
    }
    setLocale(locale) {
        this.language = locale;
        return this;
    }
    setUserId(userId) {
        this.dialogId = userId;
        return this;
    }
    setAccessToken(accessToken) {
        return this;
    }
    setRawText(text) {
        this.text = text;
        return this;
    }
    setConfidence(confidence) {
        this.confidence = confidence;
        return this;
    }
    setCallbackUrl(url) {
        this.callback = url;
        return this;
    }
    setLocal(phoneNumber) {
        this.local = phoneNumber;
        return this;
    }
    setRemote(phoneNumber) {
        this.remote = phoneNumber;
        return this;
    }
    setAudioInterface() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
        return this;
    }
    setScreenInterface() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
        return this;
    }
    setVideoInterface() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
        return this;
    }
    setInputs(inputs) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly");
        return this;
    }
    setIntentName(intentName) {
        // used in integration's own tests
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            if (!this.nlu) {
                this.nlu = {};
            }
            this.nlu.intentName = intentName;
        }
        else {
            jovo_core_1.Log.warn("Lindenbaum doesn't parse the intent in the request. Please use this.$nlu.intent.name to set the intent name.");
        }
        return this;
    }
    setSessionAttributes(attributes) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
        return this;
    }
    setSessionData(sessionData) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
        return this;
    }
    setState(state) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse state data in the request. Please use this.setState() instead.");
        return this;
    }
    setNewSession(isNew) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse a flag for new sessions in the request. Simply use a unique dialogId in your request instead.");
        return this;
    }
    addInput(key, value) {
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            if (!this.nlu) {
                this.nlu = {};
            }
            if (!this.nlu.inputs) {
                this.nlu.inputs = {};
            }
            if (typeof value === 'string') {
                this.nlu.inputs[key] = {
                    name: key,
                    value,
                };
            }
            else {
                this.nlu.inputs[key] = value;
            }
        }
        else {
            jovo_core_1.Log.warn("Lindenbaum doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly");
        }
        return this;
    }
    // tslint:disable-next-line:no-any
    addSessionAttribute(key, value) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
        return this;
    }
    // tslint:disable-next-line:no-any
    addSessionData(key, value) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
        return this;
    }
    // tslint:disable-next-line:no-any
    toJSON() {
        return Object.assign({}, this);
    }
}
exports.LindenbaumRequest = LindenbaumRequest;
//# sourceMappingURL=LindenbaumRequest.js.map