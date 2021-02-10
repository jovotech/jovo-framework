"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const jovo_core_1 = require("jovo-core");
/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */
class DialogflowResponse {
    getContext(name) {
        var _a;
        return (_a = this.outputContexts) === null || _a === void 0 ? void 0 : _a.find((context) => {
            return context.name.indexOf(`/contexts/_jovo_${name}_`) > -1;
        });
    }
    hasContext(name) {
        return this.getContext(name) ? true : false;
    }
    getPlatformId() {
        if (this.payload) {
            const keys = Object.keys(this.payload);
            if (keys.length > 0) {
                return keys[0];
            }
        }
    }
    getSessionData(path) {
        if (path) {
            return this.getSessionAttribute(path);
        }
        else {
            return this.getSessionAttributes();
        }
    }
    // tslint:disable-next-line
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    getSessionAttributes() {
        if (this.outputContexts) {
            const sessionContext = this.getContext('session');
            if (sessionContext) {
                return sessionContext.parameters;
            }
        }
        return {};
    }
    getSessionAttribute(path) {
        const sessionData = this.getSessionAttributes();
        return _get(sessionData, path);
    }
    // TODO:
    setSessionAttributes(sessionData) {
        return this;
    }
    hasSessionEnded() {
        const platformId = this.getPlatformId();
        if (this.payload && platformId) {
            if (typeof _get(this.payload, `${platformId}.hasSessionEnded`) === 'function') {
                return this.payload[platformId].hasSessionEnded();
            }
        }
        return !this.hasContext('ask');
    }
    getSpeech() {
        const platformId = this.getPlatformId();
        if (this.payload && platformId) {
            if (typeof _get(this.payload, `${platformId}.getSpeech`) === 'function') {
                const speech = this.payload[platformId].getSpeech();
                if (!speech) {
                    return;
                }
                return jovo_core_1.SpeechBuilder.removeSpeakTags(speech);
            }
        }
        return this.fulfillmentText ? jovo_core_1.SpeechBuilder.removeSpeakTags(this.fulfillmentText) : '';
    }
    getReprompt() {
        const platformId = this.getPlatformId();
        if (this.payload && platformId) {
            if (typeof _get(this.payload, `${platformId}.getReprompt`) === 'function') {
                const reprompt = this.payload[platformId].getReprompt();
                if (!reprompt) {
                    return;
                }
                return jovo_core_1.SpeechBuilder.removeSpeakTags(reprompt);
            }
        }
        return undefined;
    }
    getSpeechPlain() {
        const speech = this.getSpeech();
        if (!speech) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSSML(speech);
    }
    getRepromptPlain() {
        const reprompt = this.getReprompt();
        if (!reprompt) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSSML(reprompt);
    }
    isTell(speech) {
        const platformId = this.getPlatformId();
        if (this.payload && platformId) {
            if (typeof _get(this.payload, `${platformId}.isTell`) === 'function') {
                return this.payload[platformId].isTell(speech);
            }
        }
        return !this.hasContext('ask');
    }
    isAsk(speech, reprompt) {
        const platformId = this.getPlatformId();
        if (this.payload && platformId) {
            if (typeof _get(this.payload, `${platformId}.isAsk`) === 'function') {
                return this.payload[platformId].isAsk(speech, reprompt);
            }
        }
        return this.hasContext('ask');
    }
    hasState(state) {
        return this.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, state);
    }
    // tslint:disable-next-line
    hasSessionAttribute(name, value) {
        if (!this.getSessionAttribute(name)) {
            return false;
        }
        if (typeof value !== 'undefined') {
            if (this.getSessionAttribute(name) !== value) {
                return false;
            }
        }
        return true;
    }
    getPlatformResponse() {
        return this.payload[this.getPlatformId()];
    }
    toJSON() {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }
    // fromJSON is used to convert an serialized version
    // of the response to an instance of the class
    static fromJSON(json) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, DialogflowResponse.reviver);
        }
        else {
            // create an instance of the class
            const response = Object.create(DialogflowResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(response, json);
        }
    }
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    // tslint:disable-next-line
    static reviver(key, value) {
        return key === '' ? DialogflowResponse.fromJSON(value) : value;
    }
}
exports.DialogflowResponse = DialogflowResponse;
//# sourceMappingURL=DialogflowResponse.js.map