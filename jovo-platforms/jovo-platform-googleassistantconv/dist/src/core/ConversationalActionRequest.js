"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _set = require("lodash.set");
const _get = require("lodash.get");
const Interfaces_1 = require("./Interfaces");
class ConversationalActionRequest {
    getSessionId() {
        var _a;
        return (_a = this.session) === null || _a === void 0 ? void 0 : _a.id;
    }
    getDeviceName() {
        if (this.hasScreenInterface()) {
            if (this.hasWebBrowserInterface()) {
                return Interfaces_1.GoogleAssistantDeviceName.GOOGLE_ASSISTANT_PHONE;
            }
            else {
                return Interfaces_1.GoogleAssistantDeviceName.GOOGLE_ASSISTANT_SMARTDISPLAY;
            }
        }
        else {
            return Interfaces_1.GoogleAssistantDeviceName.GOOGLE_ASSISTANT_SPEAKER;
        }
    }
    getIntentName() {
        var _a;
        return (_a = this.intent) === null || _a === void 0 ? void 0 : _a.name;
    }
    getSessionData() {
        var _a;
        return ((_a = this.session) === null || _a === void 0 ? void 0 : _a.params) || {};
    }
    setSessionData(sessionData) {
        var _a;
        if (!((_a = this.session) === null || _a === void 0 ? void 0 : _a.params)) {
            this.session.params = {};
        }
        return this;
    }
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    setUserId(userId) {
        _set(this, 'user.userId', userId);
        return this;
    }
    toJSON() {
        return Object.assign({}, this);
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, ConversationalActionRequest.reviver);
        }
        else {
            const request = Object.create(ConversationalActionRequest.prototype);
            return Object.assign(request, json);
        }
    }
    static reviver(key, value) {
        return key === '' ? ConversationalActionRequest.fromJSON(value) : value;
    }
    addInput(key, value) {
        return this;
    }
    addSessionAttribute(key, value) {
        return this;
    }
    getAccessToken() {
        return _get(this, 'user.accessToken');
    }
    getInputs() {
        var _a, _b, _c, _d, _e, _f;
        const inputs = {};
        if ((_a = this.intent) === null || _a === void 0 ? void 0 : _a.params) {
            for (const param in (_b = this.intent) === null || _b === void 0 ? void 0 : _b.params) {
                if ((_c = this.intent) === null || _c === void 0 ? void 0 : _c.params.hasOwnProperty(param)) {
                    inputs[param] = {
                        id: (_d = this.intent) === null || _d === void 0 ? void 0 : _d.params[param].resolved,
                        value: (_e = this.intent) === null || _e === void 0 ? void 0 : _e.params[param].original,
                        key: (_f = this.intent) === null || _f === void 0 ? void 0 : _f.params[param].resolved,
                        name: param,
                    };
                }
            }
            return inputs;
        }
        return {};
    }
    getLocale() {
        return _get(this, 'user.locale');
    }
    getSessionAttributes() {
        return undefined;
    }
    getTimestamp() {
        return new Date().toISOString();
    }
    getUserId() {
        return '';
    }
    getUserStorage() {
        return _get(this, 'user.params');
    }
    hasWebBrowserInterface() {
        if (this.device) {
            return !!this.device.capabilities.find((cap) => cap === 'WEB_LINK');
        }
        return false;
    }
    hasAudioInterface() {
        if (this.device) {
            return !!this.device.capabilities.find((cap) => cap === 'SPEECH' || cap === 'LONG_FORM_AUDIO');
        }
        return false;
    }
    hasScreenInterface() {
        if (this.device) {
            return !!this.device.capabilities.find((cap) => cap === 'RICH_RESPONSE');
        }
        return false;
    }
    hasVideoInterface() {
        return false;
    }
    hasLongFormAudioInterface() {
        if (this.device) {
            return !!this.device.capabilities.find((cap) => cap === 'LONG_FORM_AUDIO');
        }
        return false;
    }
    isNewSession() {
        return !_get(this, 'session.params._JOVO_SESSION_');
    }
    setAccessToken(accessToken) {
        _set(this, `user.accessToken`, accessToken);
        return this;
    }
    setAudioInterface() {
        var _a;
        if (!this.hasAudioInterface()) {
            (_a = this.device) === null || _a === void 0 ? void 0 : _a.capabilities.push('SPEECH');
        }
        return this;
    }
    setLocale(locale) {
        _set(this, `user.locale`, locale);
        return this;
    }
    setNewSession(isNew) {
        return this;
    }
    setScreenInterface() {
        var _a;
        if (!this.hasScreenInterface()) {
            (_a = this.device) === null || _a === void 0 ? void 0 : _a.capabilities.push('RICH_RESPONSE');
        }
        return this;
    }
    setWebBrowserInterface() {
        var _a;
        if (!this.hasWebBrowserInterface()) {
            (_a = this.device) === null || _a === void 0 ? void 0 : _a.capabilities.push('WEB_LINK');
        }
        return this;
    }
    setSessionAttributes(attributes) {
        if (_get(this, 'session.params')) {
            _set(this, `session.params`, attributes);
        }
        return this;
    }
    setState(state) {
        if (_get(this, 'session.params')) {
            _set(this, `session.params[${jovo_core_1.SessionConstants.STATE}]`, state);
        }
        return this;
    }
    getState() {
        return _get(this, `session.params[${jovo_core_1.SessionConstants.STATE}]`);
    }
    setInputs(inputs) {
        for (const [key, value] of Object.entries(inputs)) {
            this.intent.params[key] = {
                original: value.id || value.value,
                resolved: value.value,
            };
        }
        return this;
    }
    setTimestamp(timestamp) {
        return this;
    }
    setIntentName(intentName) {
        this.intent.name = intentName;
        return this;
    }
    setVideoInterface() {
        return this;
    }
}
exports.ConversationalActionRequest = ConversationalActionRequest;
//# sourceMappingURL=ConversationalActionRequest.js.map