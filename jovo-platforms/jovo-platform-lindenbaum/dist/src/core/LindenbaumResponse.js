"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class LindenbaumResponse {
    constructor() {
        this.responses = [];
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json);
        }
        else {
            const lindenbaumResponse = Object.create(LindenbaumResponse.prototype);
            return Object.assign(lindenbaumResponse, json);
        }
    }
    getSpeech() {
        const speechResponses = this.responses.filter((response) => {
            return response['/call/say'];
        });
        if (speechResponses.length < 1)
            return;
        /**
         * Removes the SSML <speak> tags and pads the strings that are in the middle
         * of the array with a empty string at the beginning.
         * That way, each array element will be separated correctly when we return the reduced string.
         */
        const formattedSpeechResponses = speechResponses.map((response, index) => {
            response['/call/say'].text = jovo_core_1.SpeechBuilder.removeSpeakTags(response['/call/say'].text);
            if (index > 0 && index < speechResponses.length - 1) {
                response['/call/say'].text = ' ' + response['/call/say'].text;
            }
            return response;
        });
        return formattedSpeechResponses.reduce((acc, curr) => acc + curr['/call/say'].text, '');
    }
    getSpeechPlain() {
        const speech = this.getSpeech();
        return speech ? jovo_core_1.SpeechBuilder.removeSSML(speech) : undefined;
    }
    /**
     * Lindenbaum doesn't support reprompts
     */
    getReprompt() {
        jovo_core_1.Log.warn("Lindenbaum doesn't support reprompts.");
        return;
    }
    getRepromptPlain() {
        jovo_core_1.Log.warn("Lindenbaum doesn't support reprompts.");
        return;
    }
    /**
     * There are no session attributes stored in the Lindenbaum response.
     * always returns `undefined`
     */
    getSessionAttributes() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the response. Please use this.$session.$data");
        return;
    }
    setSessionAttributes(sessionAttributes) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the response. Please use this.$session.$data");
        return this;
    }
    /**
     * There are no session attributes stored in the Lindenbaum response.
     * always returns `undefined`
     */
    getSessionData() {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the response. Please use this.$session.$data");
        return;
    }
    /**
     * There are no session attributes stored in the Lindenbaum response.
     * always returns `undefined`
     */
    setSessionData(sessionData) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the response. Please use this.$session.$data");
        return this;
    }
    hasState(state) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse the state in the request. Please use this.getState() instead and check manually.");
        return false;
    }
    // tslint:disable-next-line:no-any
    hasSessionData(name, value) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the response. Please use this.$session.$data");
        return false;
    }
    // tslint:disable-next-line:no-any
    hasSessionAttribute(name, value) {
        jovo_core_1.Log.warn("Lindenbaum doesn't parse session data in the response. Please use this.$session.$data");
        return false;
    }
    isTell(speechText) {
        const hasDropResponse = this.responses.some((response) => {
            return response['/call/drop'];
        });
        if (!hasDropResponse) {
            return false; // session doesn't end -> can't be tell()
        }
        const sayResponses = this.responses.filter((response) => {
            return response['/call/say'];
        });
        if (sayResponses.length === 0) {
            return false; // no speech output -> can't be tell()
        }
        if (speechText) {
            /**
             * we have to check if any of speechText's elements are equal to
             * any of speech outputs in the response
             */
            if (Array.isArray(speechText)) {
                for (const speech of speechText) {
                    const speechTextIsInResponses = sayResponses.some((response) => {
                        return response['/call/say'].text === jovo_core_1.SpeechBuilder.toSSML(speech);
                    });
                    if (speechTextIsInResponses) {
                        return true;
                    }
                }
            }
            else {
                return sayResponses.some((response) => {
                    return response['/call/say'].text === jovo_core_1.SpeechBuilder.toSSML(speechText);
                });
            }
        }
        return true;
    }
    isAsk(speechText) {
        const hasDropResponse = this.responses.some((response) => {
            return response['/call/drop'];
        });
        if (hasDropResponse) {
            return false; // session ends -> can't be ask()
        }
        const sayResponses = this.responses.filter((response) => {
            return response['/call/say'];
        });
        if (sayResponses.length === 0) {
            return false; // no speech output -> can't be ask()
        }
        if (speechText) {
            /**
             * we have to check if any of speechText's elements are equal to
             * any of speech outputs in the response
             */
            if (Array.isArray(speechText)) {
                for (const speech of speechText) {
                    const speechTextIsInResponses = sayResponses.some((response) => {
                        return response['/call/say'].text === jovo_core_1.SpeechBuilder.toSSML(speech);
                    });
                    if (speechTextIsInResponses) {
                        return true;
                    }
                }
            }
            else {
                return sayResponses.some((response) => {
                    return response['/call/say'].text === jovo_core_1.SpeechBuilder.toSSML(speechText);
                });
            }
        }
        return true;
    }
    hasSessionEnded() {
        return this.responses.some((response) => {
            return response['/call/drop'];
        });
    }
}
exports.LindenbaumResponse = LindenbaumResponse;
//# sourceMappingURL=LindenbaumResponse.js.map