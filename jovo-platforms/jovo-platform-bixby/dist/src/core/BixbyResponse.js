"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = __importDefault(require("lodash.get"));
class BixbyResponse {
    static fromJSON(jsonRaw) {
        const json = typeof jsonRaw === 'string' ? JSON.parse(jsonRaw) : jsonRaw;
        const response = Object.create(BixbyResponse.prototype);
        return Object.assign(response, json);
    }
    setSessionId(id) {
        if (!this._JOVO_SESSION_DATA_) {
            this._JOVO_SESSION_DATA_ = {
                _JOVO_SESSION_ID_: '',
            };
        }
        this._JOVO_SESSION_DATA_._JOVO_SESSION_ID_ = id;
        return this;
    }
    getSessionId() {
        if (this._JOVO_SESSION_DATA_) {
            return this._JOVO_SESSION_DATA_._JOVO_SESSION_ID_;
        }
    }
    getSpeech() {
        return this._JOVO_SPEECH_;
    }
    getReprompt() {
        // TODO: implement reprompt
        return this._JOVO_SPEECH_;
    }
    getSpeechPlain() {
        return this._JOVO_TEXT_;
    }
    getRepromptPlain() {
        // TODO: implement reprompt
        return this._JOVO_TEXT_;
    }
    getSessionAttributes() {
        return this._JOVO_SESSION_DATA_;
    }
    setSessionAttributes(sessionAttributes) {
        this._JOVO_SESSION_DATA_ = sessionAttributes;
        return this;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    isTell(speechText) {
        throw new Error('Method not implemented.');
    }
    isAsk(speechText, repromptText) {
        throw new Error('Method not implemented.');
    }
    hasState(state) {
        return state === lodash_get_1.default(this._JOVO_SESSION_DATA_, '_JOVO_STATE_');
    }
    getSessionAttribute(key) {
        return this._JOVO_SESSION_DATA_[key];
    }
    // tslint:disable:no-any
    hasSessionAttribute(name, value) {
        const sessionAttribute = this.getSessionAttribute(name);
        if (value && sessionAttribute === value) {
            return true;
        }
        return false;
    }
    // tslint:disable:no-any
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    hasSessionEnded() {
        // TODO implement
        return true;
    }
}
exports.BixbyResponse = BixbyResponse;
//# sourceMappingURL=BixbyResponse.js.map