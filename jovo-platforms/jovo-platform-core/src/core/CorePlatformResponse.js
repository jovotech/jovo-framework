"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jovo_core_1 = require("jovo-core");
var _get = require("lodash.get");
var _set = require("lodash.set");
var CorePlatformResponse = /** @class */ (function () {
    function CorePlatformResponse() {
        this.version = '1.0';
        this.response = {};
        this.sessionData = {};
        this.userData = {};
    }
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    CorePlatformResponse.reviver = function (key, value) {
        // tslint:disable-line
        return key === '' ? CorePlatformResponse.fromJSON(value) : value;
    };
    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    CorePlatformResponse.fromJSON = function (json) {
        // if it's a string, parse it first
        if (typeof json === 'string') {
            return JSON.parse(json, CorePlatformResponse.reviver);
        }
        else {
            var response = Object.create(CorePlatformResponse.prototype);
            return Object.assign(response, json);
        }
    };
    CorePlatformResponse.prototype.getReprompt = function () {
        if (!_get(this, 'response.output.reprompt.text')) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'response.output.reprompt.text'));
    };
    CorePlatformResponse.prototype.getRepromptPlain = function () {
        var reprompt = this.getReprompt();
        if (!reprompt) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSSML(reprompt);
    };
    CorePlatformResponse.prototype.getSessionAttributes = function () {
        return this.sessionData;
    };
    CorePlatformResponse.prototype.getSessionData = function () {
        return this.getSessionAttributes();
    };
    CorePlatformResponse.prototype.getSpeech = function () {
        if (!_get(this, 'response.output.speech.text')) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'response.output.speech.text'));
    };
    CorePlatformResponse.prototype.getSpeechPlain = function () {
        var speech = this.getSpeech();
        if (!speech) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSSML(speech);
    };
    CorePlatformResponse.prototype.hasSessionAttribute = function (name, value) {
        if (!this.getSessionAttribute(name)) {
            return false;
        }
        if (typeof value !== 'undefined') {
            if (this.getSessionAttribute(name) !== value) {
                return false;
            }
        }
        return true;
    };
    CorePlatformResponse.prototype.hasSessionData = function (name, value) {
        return this.hasSessionAttribute(name, value);
    };
    CorePlatformResponse.prototype.hasSessionEnded = function () {
        return _get(this, 'response.shouldEndSession');
    };
    CorePlatformResponse.prototype.hasState = function (state) {
        return this.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, state);
    };
    CorePlatformResponse.prototype.isAsk = function (speechText, repromptText) {
        if (_get(this, 'response.shouldEndSession') === true) {
            return false;
        }
        if (speechText) {
            var text = _get(this, 'response.output.speech.text');
            if (Array.isArray(speechText)) {
                for (var _i = 0, speechText_1 = speechText; _i < speechText_1.length; _i++) {
                    var speechTextElement = speechText_1[_i];
                    if (speechTextElement === text) {
                        return true;
                    }
                }
                return false;
            }
            else {
                if (text !== speechText) {
                    return false;
                }
            }
        }
        if (repromptText) {
            var text = _get(this, 'response.output.reprompt.text');
            if (Array.isArray(repromptText)) {
                for (var _a = 0, repromptText_1 = repromptText; _a < repromptText_1.length; _a++) {
                    var speechTextElement = repromptText_1[_a];
                    if (speechTextElement === text) {
                        return true;
                    }
                }
                return false;
            }
            else {
                if (text !== repromptText) {
                    return false;
                }
            }
        }
        if (!_get(this, 'response.output.speech') || !_get(this, 'response.output.speech.text')) {
            return false;
        }
        if (!_get(this, 'response.output.reprompt') || !_get(this, 'response.output.reprompt.text')) {
            return false;
        }
        return true;
    };
    CorePlatformResponse.prototype.isTell = function (speechText) {
        if (_get(this, 'response.shouldEndSession') === false) {
            return false;
        }
        if (speechText) {
            var text = _get(this, 'response.output.speech.text');
            if (Array.isArray(speechText)) {
                for (var _i = 0, speechText_2 = speechText; _i < speechText_2.length; _i++) {
                    var speechTextElement = speechText_2[_i];
                    if (speechTextElement === text) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return text === speechText;
            }
        }
        return true;
    };
    CorePlatformResponse.prototype.setSessionAttributes = function (sessionAttributes) {
        _set(this, "sessionData", sessionAttributes);
        return this;
    };
    CorePlatformResponse.prototype.setSessionData = function (sessionData) {
        return this.setSessionAttributes(sessionData);
    };
    CorePlatformResponse.prototype.getSessionAttribute = function (name) {
        return _get(this, "sessionData." + name);
    };
    return CorePlatformResponse;
}());
exports.CorePlatformResponse = CorePlatformResponse;
