import {JovoResponse, SpeechBuilder, SessionConstants, SessionData} from "jovo-core";
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface SessionAttributes {
    [key: string]: any; //tslint:disable-line
}

export interface Directive {
    type: string;
    updatedIntent?: object;
    slotToElicit?: string;
}

export interface Response {
    shouldEndSession?: boolean;
    directives?: Directive[];
}

export interface AlexaResponseJSON {
    version: string;
    response: Response;
    sessionAttributes?: SessionAttributes;
}

/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */


export class AlexaResponse implements JovoResponse {
    version: string;
    response: Response;
    sessionAttributes?: SessionAttributes;

    constructor() {
        this.version = '1.0';
        this.response = {
            shouldEndSession: true,
        };
        this.sessionAttributes = {};
    }

    getSessionData(path?: string) {
        if (path) {
            return this.getSessionAttribute(path);
        } else {
            return this.getSessionAttributes();
        }
    }

    hasSessionData(name: string, value?: any): boolean { // tslint:disable-line
        return this.hasSessionAttribute(name, value);
    }

    setSessionData(sessionData: SessionData) {
        return this.setSessionAttributes(sessionData);
    }

    getSessionAttributes() {
        return _get(this, 'sessionAttributes');
    }



    setSessionAttributes(sessionData: SessionData) {
        _set(this, 'sessionAttributes', sessionData);
        return this;
    }

    getSpeech() {
        if (!_get(this, 'response.outputSpeech.ssml')) {
            return;
        }
        return SpeechBuilder.removeSpeakTags(_get(this, 'response.outputSpeech.ssml'));
    }
    getReprompt() {
        if (!_get(this, 'response.outputSpeech.ssml')) {
            return;
        }
        return SpeechBuilder.removeSpeakTags(_get(this, 'response.reprompt.outputSpeech.ssml'));
    }


    getSpeechPlain() {
        const speech = this.getSpeech();
        if (!speech) {
            return;
        }

        return SpeechBuilder.removeSSML(speech);
    }
    getRepromptPlain() {
        const reprompt = this.getReprompt();
        if (!reprompt) {
            return;
        }

        return SpeechBuilder.removeSSML(reprompt);
    }

    getSessionAttribute(name: string) {
        return _get(this, `sessionAttributes.${name}`);
    }

    /**
     *
     * @param {string} name
     * @param {any} value
     * @return {boolean}
     */
    hasSessionAttribute(name: string, value?: any): boolean { // tslint:disable-line
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

    hasState(state: string): boolean {
        return this.hasSessionAttribute(SessionConstants.STATE, state);
    }

    hasSessionEnded() {
        return _get(this, 'response.shouldEndSession');
    }

    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText?: string | string[]): boolean {
        if (_get(this, 'response.shouldEndSession') === false) {
            return false;
        }
        if (speechText) {
            const ssml:string =  _get(this, 'response.outputSpeech.ssml');

            if (Array.isArray(speechText)) {
                for (const speechTextElement of speechText) {
                    if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            } else {
                return ssml === SpeechBuilder.toSSML(speechText);
            }
        }
        return true;
    }

    isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
        if (_get(this, 'response.shouldEndSession') === true) {
            return false;
        }
        if (speechText) {
            const ssml:string =  _get(this, 'response.outputSpeech.ssml');

            if (Array.isArray(speechText)) {
                for (const speechTextElement of speechText) {
                    if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            } else {
                if (ssml !== SpeechBuilder.toSSML(speechText)) {
                    return false;
                }
            }
        }

        if (repromptText) {
            const ssml:string =  _get(this, 'response.reprompt.outputSpeech.ssml');

            if (Array.isArray(repromptText)) {
                for (const speechTextElement of repromptText) {
                    if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            } else {
                if (ssml !== SpeechBuilder.toSSML(repromptText)) {
                    return false;
                }
            }
        }

        if (!_get(this, 'response.outputSpeech.ssml') ||
            !_get(this, 'response.outputSpeech.type')) {
            return false;
        }
        if (!_get(this, 'response.reprompt.outputSpeech.ssml') ||
            !_get(this, 'response.reprompt.outputSpeech.type')) {
            return false;
        }
        return true;
    }

    /**
     * Checks if response is a dialog directive response.
     * @param {'Dialog.Delegate' | 'Dialog.ElicitSlot' |'Dialog.ConfirmIntent' | 'Dialog.ConfirmSlot'} type
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDirective(type:
                          'Dialog.Delegate' |
                          'Dialog.ElicitSlot' |
                          'Dialog.ConfirmIntent' |
                          'Dialog.ConfirmSlot', updatedIntent: object) {
        if (this.response.shouldEndSession === true) {
            return false;
        }
        if (!this.response.directives) {
            return false;
        }

        if (type) { // every time first element?
            if (this.response.directives[0].type !== type) {
                return false;
            }
        }
        if (this.response.directives[0].type.substr(0, 6) !== 'Dialog') {
            return false;
        }

        if (updatedIntent) {
            if (JSON.stringify(this.response.directives[0].updatedIntent) ===
                JSON.stringify(updatedIntent)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if response is a dialog delegate response.
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDelegate(updatedIntent: object) {
        return this.isDialogDirective('Dialog.Delegate', updatedIntent);
    }

    /**
     * Checks if response is a dialog elicit slot response.
     * @param {string} slotToElicit
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogElicitSlot(slotToElicit: string, speechText: string, repromptSpeech: string, updatedIntent: object) {
        if (slotToElicit) {
            if (_get(this, 'response.directives[0].slotToElicit') !== slotToElicit) {
                return false;
            }
        }
        if (speechText) {
            if (speechText !== this.getSpeechPlain()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptPlain()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ElicitSlot', updatedIntent);
    }

    /**
     * Checks if response is a dialog confirm slot response.
     * @param {string} slotToConfirm
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmSlot(slotToConfirm: string, speechText: string, repromptSpeech: string, updatedIntent: object) {
        if (slotToConfirm) {
            if (_get(this, 'response.directives[0].slotToConfirm') !== slotToConfirm) {
                return false;
            }
        }
        if (speechText) {
            if (speechText !== this.getSpeechPlain()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptPlain()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ConfirmSlot', updatedIntent);
    }

    /**
     * Checks if response is a dialog confirm intent response.
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmIntent(speechText: string, repromptSpeech: string, updatedIntent: object) {
        if (speechText) {
            if (speechText !== this.getSpeechPlain()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptPlain()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ConfirmIntent', updatedIntent);
    }

    toJSON(): AlexaResponseJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: AlexaResponseJSON|string) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, AlexaResponse.reviver);
        } else {
            // create an instance of the User class
            const alexaResponse = Object.create(AlexaResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(alexaResponse, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { // tslint:disable-line
        return key === "" ? AlexaResponse.fromJSON(value) : value;
    }
}
