"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const _mapValues = require("lodash.mapvalues");
const jovo_core_1 = require("jovo-core");
class DialogflowRequest {
    constructor(originalRequest) {
        this.originalDetectIntentRequest.payload = originalRequest;
    }
    getDeviceName() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.getDeviceName') === 'function') {
            return this.originalDetectIntentRequest.payload.getDeviceName();
        }
        return;
    }
    getSessionId() {
        return this.session;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    // tslint:disable-next-line
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    getAccessToken() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.getAccessToken') === 'function') {
            return this.originalDetectIntentRequest.payload.getAccessToken();
        }
        return 'DIALOGFLOW-DEFAULT-ACCESS-TOKEN';
    }
    getLocale() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.getLocale') === 'function') {
            return this.originalDetectIntentRequest.payload.getLocale();
        }
        return this.queryResult.languageCode;
    }
    getTimestamp() {
        return new Date().toISOString();
    }
    getUserId() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.getUserId') === 'function') {
            return this.originalDetectIntentRequest.payload.getUserId();
        }
        return 'DIALOGFLOW-DEFAULT-USER-ID';
    }
    isNewSession() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.isNewSession') === 'function') {
            return this.originalDetectIntentRequest.payload.isNewSession();
        }
        const askContext = this.getAskContext();
        return typeof askContext === 'undefined';
    }
    getIntentName() {
        return this.queryResult.intent.displayName;
    }
    setUserId(userId) {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setUserId') === 'function') {
            this.originalDetectIntentRequest.payload.setUserId(userId);
        }
        return this;
    }
    /**
     * Returns session context of request
     */
    getSessionContext() {
        const sessionId = this.session;
        if (this.queryResult && this.queryResult.outputContexts) {
            return this.queryResult.outputContexts.find((context) => {
                return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
            });
        }
    }
    /**
     * Returns ask context of request
     */
    getAskContext() {
        const sessionId = this.session;
        if (this.queryResult && this.queryResult.outputContexts) {
            return this.queryResult.outputContexts.find((context) => {
                return context.name.startsWith(`${sessionId}/contexts/_jovo_ask_`);
            });
        }
    }
    toJSON() {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }
    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, DialogflowRequest.reviver);
        }
        else {
            // create an instance of the User class
            const request = Object.create(DialogflowRequest.prototype);
            // copy all the fields from the json object
            return Object.assign(request, json);
        }
    }
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    // tslint:disable-next-line
    static reviver(key, value) {
        return key === '' ? DialogflowRequest.fromJSON(value) : value;
    }
    addInput(key, value) {
        this.queryResult.parameters[key] = value;
        return this;
    }
    setIntentName(intentName) {
        this.queryResult.intent.displayName = intentName;
        return this;
    }
    // tslint:disable-next-line
    addSessionAttribute(key, value) {
        const sessionId = _get(this, 'session');
        const sessionContext = _get(this, 'queryResult.outputContexts', []).find((context) => {
            return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
        });
        if (sessionContext) {
            sessionContext.lifespanCount = 1;
            sessionContext.parameters[key] = value;
        }
        else {
            this.queryResult.outputContexts.push({
                lifespanCount: 1,
                name: `${sessionId}/contexts/_jovo_session_`,
                parameters: {
                    [key]: value,
                },
            });
        }
        return this;
    }
    getInputs() {
        // tslint:disable-line
        const params = _get(this, 'queryResult.parameters');
        const inputs = _mapValues(params, (value, name) => {
            return {
                name,
                value,
                key: value,
                id: value,
            };
        });
        if (this.queryResult.outputContexts && this.queryResult.outputContexts.length > 0) {
            const parameters = this.queryResult.outputContexts[0].parameters;
            for (const key in parameters) {
                if (inputs[key]) {
                    const originalKey = key + '.original';
                    inputs[key] = {
                        name: parameters[key],
                        value: parameters[originalKey],
                        key: parameters[key],
                        id: parameters[key],
                    };
                }
            }
        }
        return inputs;
    }
    setInputs(inputs) {
        Object.keys(inputs).forEach((key) => {
            const input = inputs[key];
            this.setParameter(key, input.value);
        });
        return this;
    }
    getState() {
        return _get(this.getSessionAttributes(), jovo_core_1.SessionConstants.STATE);
    }
    getSessionAttributes() {
        // tslint:disable-line
        const sessionId = _get(this, 'session');
        let sessionAttributes = {}; // tslint:disable-line
        const sessionContext = _get(this, 'queryResult.outputContexts', []).find((context) => {
            return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
        });
        if (sessionContext) {
            sessionAttributes = sessionContext.parameters;
            for (const parameter of Object.keys(_get(this, 'queryResult.parameters'))) {
                delete sessionAttributes[parameter];
                delete sessionAttributes[parameter + '.original'];
            }
        }
        return sessionAttributes;
    }
    setSessionAttributes(attributes) {
        // tslint:disable-line
        const sessionId = _get(this, 'session');
        const sessionContext = _get(this, 'queryResult.outputContexts', []).find((context) => {
            return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
        });
        if (sessionContext) {
            sessionContext.lifespanCount = 1;
            sessionContext.parameters = attributes;
        }
        else {
            this.queryResult.outputContexts.push({
                lifespanCount: 1,
                name: `${sessionId}/contexts/_jovo_session_${Math.random()
                    .toString(36)
                    .replace(/[^a-z]+/g, '')
                    .substr(0, 5)}`,
                parameters: attributes,
            });
        }
        return this;
    }
    hasAudioInterface() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.hasAudioInterface') === 'function') {
            return this.originalDetectIntentRequest.payload.hasAudioInterface();
        }
        return true;
    }
    hasScreenInterface() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.hasScreenInterface') === 'function') {
            return this.originalDetectIntentRequest.payload.hasScreenInterface();
        }
        return true;
    }
    hasVideoInterface() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.hasScreenInterface') === 'function') {
            return this.originalDetectIntentRequest.payload.hasVideoInterface();
        }
        return false;
    }
    setAccessToken(accessToken) {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setAccessToken') === 'function') {
            this.originalDetectIntentRequest.payload.setAccessToken(accessToken);
        }
        return this;
    }
    setAudioInterface() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setAudioInterface') === 'function') {
            this.originalDetectIntentRequest.payload.setAudioInterface();
        }
        return this;
    }
    setLocale(locale) {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setLocale') === 'function') {
            this.originalDetectIntentRequest.payload.setLocale(locale);
        }
        _set(this, 'queryResult.languageCode', locale);
        return this;
    }
    setNewSession(isNew) {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setNewSession') === 'function') {
            this.originalDetectIntentRequest.payload.setNewSession(isNew);
        }
        return this;
    }
    setScreenInterface() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setScreenInterface') === 'function') {
            this.originalDetectIntentRequest.payload.setScreenInterface();
        }
        return this;
    }
    setVideoInterface() {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setVideoInterface') === 'function') {
            this.originalDetectIntentRequest.payload.setVideoInterface();
        }
        return this;
    }
    setState(state) {
        const sessionId = _get(this, 'session');
        const sessionContext = _get(this, 'queryResult.outputContexts', []).find((context) => {
            return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
        });
        if (sessionContext) {
            sessionContext.lifespanCount = 1;
            sessionContext.parameters[jovo_core_1.SessionConstants.STATE] = state;
        }
        else {
            this.queryResult.outputContexts.push({
                lifespanCount: 1,
                name: `${sessionId}/contexts/_jovo_session_${Math.random()
                    .toString(36)
                    .replace(/[^a-z]+/g, '')
                    .substr(0, 5)}`,
                parameters: {
                    [jovo_core_1.SessionConstants.STATE]: state,
                },
            });
        }
        return this;
    }
    setTimestamp(timestamp) {
        if (typeof _get(this.originalDetectIntentRequest, 'payload.setTimestamp') === 'function') {
            this.originalDetectIntentRequest.payload.setTimestamp(timestamp);
        }
        return this;
    }
    // DialogRequest Helper
    setParameter(key, value) {
        this.queryResult.parameters[key] = value;
        return this;
    }
    getParameters() {
        return this.queryResult.parameters;
    }
}
exports.DialogflowRequest = DialogflowRequest;
//# sourceMappingURL=DialogflowRequest.js.map