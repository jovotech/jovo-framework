"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _set = require("lodash.set");
class CorePlatformRequest {
    constructor() {
        this.version = '3.4.0';
        this.type = 'jovo-platform-core';
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, CorePlatformRequest.reviver);
        }
        else {
            const corePlatformRequest = Object.create(CorePlatformRequest.prototype);
            return Object.assign(corePlatformRequest, json);
        }
    }
    // tslint:disable-next-line:no-any
    static reviver(key, value) {
        return key === '' ? CorePlatformRequest.fromJSON(value) : value;
    }
    addInput(key, value) {
        if (typeof value === 'string') {
            _set(this, `request.nlu.inputs.${key}`, {
                name: key,
                value,
            });
        }
        else {
            _set(this, `request.nlu.inputs.${key}`, value);
        }
        return this;
    }
    // tslint:disable-next-line:no-any
    addSessionAttribute(key, value) {
        if (this.getSessionAttributes()) {
            _set(this, `context.session.data.${key}`, value);
        }
        return this;
    }
    // tslint:disable-next-line:no-any
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    getAccessToken() {
        return _get(this, `context.user.accessToken`);
    }
    getInputs() {
        return _get(this, `request.nlu.inputs`, {});
    }
    getIntentName() {
        return _get(this, `request.nlu.intent`);
    }
    getLocale() {
        return _get(this, `request.locale`, '');
    }
    getSessionAttributes() {
        return _get(this, 'context.session.data', {});
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    getSessionId() {
        return _get(this, 'context.session.id');
    }
    getState() {
        return _get(this.getSessionAttributes(), jovo_core_1.SessionConstants.STATE);
    }
    // tslint:disable-next-line:no-any
    getSupportedInterfaces() {
        return _get(this, `context.device.capabilities`, []);
    }
    getTimestamp() {
        return _get(this, `request.timestamp`, '');
    }
    getUserId() {
        return _get(this, 'context.user.id', '');
    }
    hasAudioInterface() {
        return this.supportsInterface('AudioPlayer');
    }
    hasScreenInterface() {
        return this.supportsInterface('Display');
    }
    hasVideoInterface() {
        return this.supportsInterface('VideoApp');
    }
    isNewSession() {
        return _get(this, `context.session.new`, true);
    }
    hasTextInput() {
        return !!_get(this, `request.body.text`);
    }
    setAccessToken(accessToken) {
        _set(this, `context.user.accessToken`, accessToken);
        return this;
    }
    setAudioInterface() {
        if (_get(this, 'request.supportedInterfaces')) {
            _set(this, 'request.supportedInterfaces', {
                AudioPlayer: {},
            });
        }
        return this;
    }
    setInputs(inputs) {
        _set(this, 'request.nlu.inputs', inputs);
        return this;
    }
    setIntentName(intentName) {
        _set(this, 'request.nlu.intent', intentName);
        return this;
    }
    setLocale(locale) {
        if (_get(this, `request.locale`)) {
            _set(this, 'request.locale', locale);
        }
        return this;
    }
    setNewSession(isNew) {
        _set(this, `context.session.new`, isNew);
        return this;
    }
    setScreenInterface() {
        if (_get(this, 'request.supportedInterfaces')) {
            _set(this, 'request.supportedInterfaces', {
                AudioPlayer: {},
                Display: {},
                VideoApp: {},
            });
        }
        return this;
    }
    setSessionAttributes(attributes) {
        _set(this, `context.session.data`, attributes);
        return this;
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    setState(state) {
        _set(this, `context.session.data[${jovo_core_1.SessionConstants.STATE}]`, state);
        return this;
    }
    setTimestamp(timestamp) {
        _set(this, 'request.timestamp', timestamp);
        return this;
    }
    setUserId(userId) {
        _set(this, 'context.user.id', userId);
        return this;
    }
    setVideoInterface() {
        if (_get(this, 'request.supportedInterfaces')) {
            _set(this, 'request.supportedInterfaces', {
                AudioPlayer: {},
                Display: {},
                VideoApp: {},
            });
        }
        return this;
    }
    supportsInterface(identifier) {
        return this.getSupportedInterfaces()[identifier];
    }
    // tslint:disable-next-line:no-any
    toJSON() {
        return Object.assign({}, this);
    }
    getDeviceName() {
        return _get(this, `context.device.type`, '');
    }
}
exports.CorePlatformRequest = CorePlatformRequest;
//# sourceMappingURL=CorePlatformRequest.js.map