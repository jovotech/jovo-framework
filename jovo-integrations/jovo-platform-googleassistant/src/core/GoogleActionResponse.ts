import {JovoResponse, SpeechBuilder, SessionData} from "jovo-core";
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
    richResponse?: RichResponse;
    userStorage?: string;
}


/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */


export class GoogleActionResponse implements JovoResponse {
    expectUserResponse?: boolean;
    richResponse?: RichResponse;
    noInputPrompts?: NoInputPrompt[];

    getSessionData(path?: string) {
        return undefined;
    }

    hasSessionData(name: string, value?: any): boolean { // tslint:disable-line
        return this.hasSessionAttribute(name, value);

    }

    setSessionData(sessionData: SessionData) {
        return this;
    }

    getDisplayText() {
        return _get(this, 'payload.google.richResponse.items[0].simpleResponse.displayText')
    }
    getSuggestionChips() {
        return _get(this, 'payload.google.richResponse.suggestions')
    }

    hasDisplayText(text?: string): boolean {
        const displayTextObject = this.getDisplayText();

        if (!displayTextObject) {
            return false;
        }

        if (text) {
            if (text !== displayTextObject) {
                return false;
            }
        }

        return true;
    }

    hasSuggestionChips(chipOne?: string, chipTwo?: string, chipThree?: string): boolean {
        const suggestionChipObject = this.getSuggestionChips();

        if (!suggestionChipObject) {
            return false;
        }

        if (chipOne) {
            if (chipOne !== suggestionChipObject[0].title) {
                return false;
            }
        }

        if (chipTwo) {
            if (chipTwo !== suggestionChipObject[1].title) {
                return false;
            }
        }

        if (chipThree) {
            if (chipThree !== suggestionChipObject[2].title) {
                return false;
            }
        }

        return true;
    }

    getSpeech() {
        if (!_get(this, 'richResponse.items[0].simpleResponse.ssml')) {
            return;
        }
        return SpeechBuilder.removeSpeakTags(_get(this, 'richResponse.items[0].simpleResponse.ssml'));
    }

    getReprompt() {
        if (!_get(this, 'noInputPrompts[0].ssml')) {
            return;
        }
        return SpeechBuilder.removeSpeakTags(_get(this, 'noInputPrompts[0].ssml'));
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


    getSessionAttributes(): any { // tslint:disable-line
        return undefined;
    }

    setSessionAttributes() {
        return this;
    }

    hasSessionAttribute(name: string, value?: any): any { // tslint:disable-line
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
                    return text === this.getSpeech();
                });

                if (results && results.length === 0) {
                    return false;
                }
            } else {
                if (speech.toString() !== this.getSpeech()) {
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
                    return text === this.getSpeech();
                });

                if (results && results.length === 0) {
                    return false;
                }
            } else {
                if (speech.toString() !== this.getSpeech()) {
                    return false;
                }
            }
        }
        if (reprompt) {
            if (Array.isArray(reprompt)) {

                const results = reprompt.find((text: string) => {
                    return text === this.getReprompt();
                });

                if (results && results.length === 0) {
                    return false;
                }
            } else {
                if (reprompt.toString() !== this.getReprompt()) {
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
