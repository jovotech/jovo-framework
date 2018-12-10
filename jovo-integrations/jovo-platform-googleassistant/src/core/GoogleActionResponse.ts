import {JovoResponse, SpeechBuilder} from "jovo-core";
import _get = require('lodash.get');

export interface RichResponseItem {
    simpleResponse: {
        ssml?: string;
    };
}


export interface RichResponse {
    items?: RichResponseItem[];
}

export interface NoInputPrompt {
    ssml?: string;
}

export interface GoogleActionResponseJSON {
    expectUserResponse?: boolean;
    noInputPrompts?: NoInputPrompt[];
}


/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */


export class GoogleActionResponse implements JovoResponse {
    expectUserResponse?: boolean;
    richResponse?: RichResponse;
    noInputPrompts?: NoInputPrompt[];

    getOutputSpeech() {
        return _get(this, 'richResponse.items[0].simpleResponse.ssml');
    }

    getRepromptSpeech() {
        return _get(this, 'noInputPrompts[0].ssml');
    }

    getSessionAttributes(): any { // tslint:disable-line
        return undefined;
    }

    setSessionAttributes() {
        return this;
    }

    hasSessionAttribute(): any { // tslint:disable-line
        return undefined;
    }

    hasState(): boolean | undefined {
        return undefined;
    }


    hasSessionEnded() {
        return !this.expectUserResponse;
    }

    isTell(speech?: string | string[]) {
        if (this.expectUserResponse === true) {
            return false;
        }

        if (speech) {
            if (Array.isArray(speech)) {

                const results = speech.find((text: string) => {
                    return SpeechBuilder.toSSML(text) === this.getOutputSpeech();
                });

                if (results && results.length === 0) {
                    return false;
                }
            } else {
                if (SpeechBuilder.toSSML(speech.toString()) !== this.getOutputSpeech()) {
                    return false;
                }
            }
        }

        return true;
    }

    isAsk(speech?: string | string[], reprompt?: string | string[]) {
        if (this.expectUserResponse === false) {
            return false;
        }

        if (speech) {
            if (Array.isArray(speech)) {

                const results = speech.find((text: string) => {
                    return SpeechBuilder.toSSML(text) === this.getOutputSpeech();
                });

                if (results && results.length === 0) {
                    return false;
                }
            } else {
                if (SpeechBuilder.toSSML(speech.toString()) !== this.getOutputSpeech()) {
                    return false;
                }
            }
        }

        if (reprompt) {
            if (Array.isArray(reprompt)) {

                const results = reprompt.find((text: string) => {
                    return SpeechBuilder.toSSML(text) === this.getRepromptSpeech();
                });

                if (results && results.length === 0) {
                    return false;
                }
            } else {
                if (SpeechBuilder.toSSML(reprompt.toString()) !== this.getRepromptSpeech()) {
                    return false;
                }
            }
        }
        return true;
    }

    toJSON(): GoogleActionResponseJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

// fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: GoogleActionResponseJSON|string) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, GoogleActionResponse.reviver);
        } else {
            // create an instance of the User class
            const alexaResponse = Object.create(GoogleActionResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(alexaResponse, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { // tslint:disable-line
        return key === "" ? GoogleActionResponse.fromJSON(value) : value;
    }
}
