"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const Interfaces_1 = require("./Interfaces");
class GoogleActionRequest {
    getSessionId() {
        if (this.conversation) {
            return this.conversation.conversationId;
        }
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
        return undefined;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    setUserId(userId) {
        const userStorage = JSON.parse(_get(this, 'user.userStorage', '{}'));
        userStorage.userId = userId;
        _set(this, 'user.userStorage', JSON.stringify(userStorage));
        return this;
    }
    toJSON() {
        return Object.assign({}, this);
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, GoogleActionRequest.reviver);
        }
        else {
            const request = Object.create(GoogleActionRequest.prototype);
            return Object.assign(request, json);
        }
    }
    static reviver(key, value) {
        return key === '' ? GoogleActionRequest.fromJSON(value) : value;
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
        return undefined;
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
        const userStorage = JSON.parse(_get(this, 'user.userStorage', '{}'));
        return _get(userStorage, 'userId');
    }
    getUserStorage() {
        return _get(this, 'user.userStorage');
    }
    hasWebBrowserInterface() {
        if (this.surface) {
            const allCapabilities = this.surface.capabilities;
            const webBrowserCap = allCapabilities.filter((currentCapability) => currentCapability.name === 'actions.capability.WEB_BROWSER');
            return webBrowserCap.length === 0 ? false : true;
        }
        return false;
    }
    hasAudioInterface() {
        const audioCapability = _get(this, 'surface.capabilities').find((item) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO');
        return typeof audioCapability !== 'undefined';
    }
    hasScreenInterface() {
        const screenCapability = _get(this, 'surface.capabilities').find((item) => item.name === 'actions.capability.SCREEN_OUTPUT');
        return typeof screenCapability !== 'undefined';
    }
    hasVideoInterface() {
        return false;
    }
    isNewSession() {
        return _get(this, 'conversation.type') !== 'ACTIVE';
    }
    setAccessToken(accessToken) {
        _set(this, `user.accessToken`, accessToken);
        return this;
    }
    setAudioInterface() {
        this.surface = {
            capabilities: [
                {
                    name: 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    name: 'actions.capability.AUDIO_OUTPUT',
                },
            ],
        };
        return this;
    }
    setLocale(locale) {
        _set(this, `user.locale`, locale);
        return this;
    }
    setNewSession(isNew) {
        const conversationType = isNew ? 'NEW' : 'ACTIVE';
        _set(this, `conversation.type`, conversationType);
        return this;
    }
    setScreenInterface() {
        this.surface = {
            capabilities: [
                {
                    name: 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    name: 'actions.capability.SCREEN_OUTPUT',
                },
                {
                    name: 'actions.capability.AUDIO_OUTPUT',
                },
                {
                    name: 'actions.capability.WEB_BROWSER',
                },
            ],
        };
        return this;
    }
    setSessionAttributes(attributes) {
        return this;
    }
    setState(state) {
        return this;
    }
    getState() {
        return undefined;
    }
    setInputs(inputs) {
        return this;
    }
    setTimestamp(timestamp) {
        return this;
    }
    setIntentName(intentName) {
        return this;
    }
    setVideoInterface() {
        return this;
    }
}
exports.GoogleActionRequest = GoogleActionRequest;
//# sourceMappingURL=GoogleActionRequest.js.map