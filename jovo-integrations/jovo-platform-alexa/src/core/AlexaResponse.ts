import {JovoResponse, SpeechBuilder, SessionConstants} from "jovo-core";
import * as _ from 'lodash';

export interface SessionAttributes {
    [key: string]: any; //tslint:disable-line
}


export interface Response {
    shouldEndSession?: boolean;
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

    getSessionAttributes() {
        return _.get(this, 'sessionAttributes');
    }

    setSessionAttributes(sessionAttributes: SessionAttributes) {
        _.set(this, 'sessionAttributes', sessionAttributes);
        return this;
    }

    getOutputSpeech() {
        return _.get(this, 'response.outputSpeech.ssml');
    }
    getRepromptSpeech() {
        return _.get(this, 'response.reprompt.outputSpeech.ssml');
    }

    getSessionAttribute(name: string) {
        return _.get(this, `sessionAttributes.${name}`);
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
        return _.get(this, 'response.shouldEndSession');
    }

    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText?: string | string[]): boolean {
        if (_.get(this, 'response.shouldEndSession') === false) {
            return false;
        }
        if (speechText) {
            const ssml:string =  _.get(this, 'response.outputSpeech.ssml');

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
        if (_.get(this, 'response.shouldEndSession') === true) {
            return false;
        }
        if (speechText) {
            const ssml:string =  _.get(this, 'response.outputSpeech.ssml');

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

        if (repromptText) {
            const ssml:string =  _.get(this, 'response.reprompt.outputSpeech.ssml');

            if (Array.isArray(repromptText)) {
                for (const speechTextElement of repromptText) {
                    if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            } else {
                return ssml === SpeechBuilder.toSSML(repromptText);
            }
        }

        if (!_.get(this, 'response.outputSpeech.ssml') ||
            !_.get(this, 'response.outputSpeech.type')) {
            return false;
        }
        if (!_.get(this, 'response.reprompt.outputSpeech.ssml') ||
            !_.get(this, 'response.reprompt.outputSpeech.type')) {
            return false;
        }
        return true;
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
