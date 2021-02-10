"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class GoogleBusinessResponse {
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json);
        }
        else {
            const googleBusinessResponse = Object.create(GoogleBusinessResponse.prototype);
            return Object.assign(googleBusinessResponse, json);
        }
    }
    getSpeech() {
        const response = this.response;
        if (!response.text) {
            return;
        }
        else {
            return jovo_core_1.SpeechBuilder.removeSpeakTags(response.text);
        }
    }
    getSpeechPlain() {
        const speech = this.getSpeech();
        return speech ? jovo_core_1.SpeechBuilder.removeSSML(speech) : undefined;
    }
    getReprompt() {
        jovo_core_1.Log.warn("Google Business Messages doesn't support reprompts.");
        return;
    }
    getRepromptPlain() {
        jovo_core_1.Log.warn("Google Business Messages doesn't support reprompts.");
        return;
    }
    getSessionAttributes() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse session data in the response. Please use this.$session");
        return;
    }
    setSessionAttributes(sessionAttributes) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse session data in the response. Please use this.$session");
        return this;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    hasState(state) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse the state in the response. Please use this.getState() instead and check manually.");
        return false;
    }
    hasSessionAttribute(name, value) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse session data in the response. Please use this.$session and check manually");
        return false;
    }
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    hasSessionEnded() {
        jovo_core_1.Log.warn("Google Business Message's response doesn't contain a flag that defines whether the session has ended or not.");
        return false;
    }
    isTell(speechText) {
        const response = this.getSpeech();
        // response doesn't contain speech output
        if (!response) {
            return false;
        }
        else {
            if (speechText) {
                if (Array.isArray(speechText)) {
                    for (const speechTextElement of speechText) {
                        if (speechTextElement === response) {
                            return true;
                        }
                    }
                    return false;
                }
                else {
                    return response === speechText;
                }
            }
            return true;
        }
    }
    isAsk(speechText) {
        return this.isTell(speechText);
    }
}
exports.GoogleBusinessResponse = GoogleBusinessResponse;
//# sourceMappingURL=GoogleBusinessResponse.js.map