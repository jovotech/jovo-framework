"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _set = require("lodash.set");
// TODO fully implement methods.
class CorePlatformResponse {
    constructor() {
        this.version = '3.4.0';
        this.actions = [];
        this.reprompts = [];
        this.user = {
            data: {},
        };
        this.session = {
            data: {},
            end: false,
        };
        this.context = {
            request: {},
        };
    }
    // tslint:disable-next-line:no-any
    static reviver(key, value) {
        return key === '' ? CorePlatformResponse.fromJSON(value) : value;
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, CorePlatformResponse.reviver);
        }
        else {
            const response = Object.create(CorePlatformResponse.prototype);
            return Object.assign(response, json);
        }
    }
    getReprompt() {
        return JSON.stringify(this.reprompts);
    }
    getRepromptPlain() {
        return this.getReprompt();
    }
    getSessionAttributes() {
        return this.session.data;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    getSpeech() {
        return JSON.stringify(this.actions);
    }
    getSpeechPlain() {
        return this.getSpeech();
    }
    // tslint:disable-next-line:no-any
    hasSessionAttribute(name, value) {
        return typeof value === 'undefined'
            ? this.getSessionAttribute(name)
            : this.getSessionAttribute(name) === value;
    }
    // tslint:disable-next-line:no-any
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    hasSessionEnded() {
        return _get(this, 'session.end', false);
    }
    hasState(state) {
        return this.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, state);
    }
    isAsk(speechText, repromptText) {
        return false;
    }
    isTell(speechText) {
        return false;
    }
    setSessionAttributes(sessionAttributes) {
        _set(this, `session.data`, sessionAttributes);
        return this;
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    getSessionAttribute(name) {
        return _get(this, `session.data.${name}`);
    }
}
exports.CorePlatformResponse = CorePlatformResponse;
//# sourceMappingURL=CorePlatformResponse.js.map