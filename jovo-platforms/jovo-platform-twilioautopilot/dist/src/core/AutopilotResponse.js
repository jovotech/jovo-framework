"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
/**
 * @see https://www.twilio.com/docs/autopilot/actions
 *
 * Twilio Autopilot response is an object containing an array of `actions`.
 * Each action is an object that contains one of the response's features.
 * For example the object with the `say` property is the normal text/voice output.
 * The object with the `play` property contains the audio file output, etc.
 */
class AutopilotResponse {
    constructor() {
        this.actions = [];
    }
    getSpeech() {
        const speechAction = this.actions.find((action) => {
            return action.say;
        });
        if (!speechAction)
            return;
        return jovo_core_1.SpeechBuilder.removeSpeakTags(speechAction.say);
    }
    /**
     * Autopilot doesn't support reprompts
     */
    getReprompt() {
        return undefined;
    }
    getSpeechPlain() {
        const sayAction = this.actions.find((action) => {
            return action.say;
        });
        if (!sayAction)
            return;
        return jovo_core_1.SpeechBuilder.removeSSML(sayAction.say);
    }
    /**
     * Autopilot doesn't support reprompts
     */
    getRepromptPlain() {
        return undefined;
    }
    getSessionAttributes() {
        const rememberAction = this.actions.find((action) => {
            return action.remember;
        });
        return rememberAction === null || rememberAction === void 0 ? void 0 : rememberAction.remember;
    }
    setSessionAttributes(sessionData) {
        const rememberAction = this.actions.find((action) => {
            return action.remember;
        });
        if (rememberAction) {
            rememberAction.remember = Object.assign(rememberAction.remember, sessionData);
        }
        else {
            const newRememberAction = { remember: sessionData };
            this.actions.push(newRememberAction);
        }
        return this;
    }
    // tslint:disable-next-line:no-any
    addSessionAttribute(key, value) {
        const rememberAction = this.actions.find((action) => {
            return action.remember;
        });
        if (rememberAction) {
            rememberAction.remember[key] = value;
        }
        else {
            const newRememberAction = { remember: { key: value } };
            this.actions.push(newRememberAction);
        }
        return this;
    }
    getSessionAttribute(path) {
        const sessionAttributes = this.getSessionAttributes();
        return sessionAttributes ? sessionAttributes[path] : undefined;
    }
    getSessionData(path) {
        if (path) {
            return this.getSessionAttribute(path);
        }
        else {
            return this.getSessionAttributes();
        }
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    isTell(speechText) {
        const hasListenAction = this.actions.some((action) => {
            return action.listen;
        });
        // is ask()!
        if (hasListenAction)
            return false;
        const sayAction = this.actions.find((action) => {
            return action.say;
        });
        // no speech output in response
        if (!sayAction)
            return false;
        if (speechText) {
            if (Array.isArray(speechText)) {
                for (const speech of speechText) {
                    if (speech === sayAction.say)
                        return true;
                }
            }
            return speechText === sayAction.say;
        }
        return true;
    }
    isAsk(speechText) {
        const hasListenAction = this.actions.some((action) => {
            return action.listen;
        });
        // can't be ask() without the Listen action
        if (!hasListenAction)
            return false;
        if (speechText) {
            // we only return true, if speechText and Say action have the same value
            const sayAction = this.actions.find((action) => {
                return action.say;
            });
            // Say action has no value but speechText does => it's not the correct ask()
            if (!sayAction) {
                return false;
            }
            if (Array.isArray(speechText)) {
                for (const speech of speechText) {
                    if (speech === sayAction.say)
                        return true;
                }
            }
            return speechText === sayAction.say;
        }
        // no speechText, and Listen action is present
        return true;
    }
    hasState(state) {
        return this.hasSessionData(jovo_core_1.SessionConstants.STATE, state);
    }
    // tslint:disable-next-line:no-any
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    // tslint:disable-next-line:no-any
    hasSessionAttribute(name, value) {
        if (value) {
            return this.getSessionAttribute(name) === value;
        }
        else {
            return this.getSessionAttribute(name) ? true : false;
        }
    }
    /**
     * Returns true if there is no Listen, Collect, or Redirect action
     */
    hasSessionEnded() {
        return !(this.isAsk() || this.hasCollect() || this.hasRedirect());
    }
    /**
     * Returns true if the `actions` array contains a Collect action
     */
    hasCollect() {
        return this.actions.some((action) => {
            return action.collect;
        });
    }
    /**
     * Returns true if the `actions` array contains a Redirect action
     */
    hasRedirect() {
        return this.actions.some((action) => {
            return action.redirect;
        });
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json);
        }
        else {
            // create an instance of the User class
            const autopilotResponse = Object.create(AutopilotResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(autopilotResponse, json);
        }
    }
}
exports.AutopilotResponse = AutopilotResponse;
//# sourceMappingURL=AutopilotResponse.js.map