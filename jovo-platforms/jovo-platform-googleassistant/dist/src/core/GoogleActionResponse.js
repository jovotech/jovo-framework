"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
class GoogleActionResponse {
    getSessionData(path) {
        return undefined;
    }
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    setSessionData(sessionData) {
        return this;
    }
    getBasicCard() {
        const items = _get(this, 'richResponse.items');
        for (let i = 0; i < items.length; i++) {
            if (items[i].basicCard) {
                return items[i].basicCard;
            }
        }
    }
    hasImageCard(title, content, imageUrl) {
        const basicCardObject = this.getBasicCard();
        if (!basicCardObject) {
            return false;
        }
        if (!basicCardObject.image) {
            return false;
        }
        if (title) {
            if (title !== basicCardObject.title) {
                return false;
            }
        }
        if (content) {
            if (content !== basicCardObject.formattedText) {
                return false;
            }
        }
        if (imageUrl) {
            if (imageUrl !== basicCardObject.image.url) {
                return false;
            }
        }
        return true;
    }
    hasSimpleCard(title, content) {
        const basicCardObject = this.getBasicCard();
        if (!basicCardObject) {
            return false;
        }
        if (basicCardObject.image) {
            return false;
        }
        if (title) {
            if (title !== basicCardObject.title) {
                return false;
            }
        }
        if (content) {
            if (content !== basicCardObject.formattedText) {
                return false;
            }
        }
        return true;
    }
    getDisplayText() {
        return _get(this, 'richResponse.items[0].simpleResponse.displayText');
    }
    getSuggestionChips() {
        return _get(this, 'richResponse.suggestions');
    }
    hasDisplayText(text) {
        const displayTextString = this.getDisplayText();
        if (!displayTextString) {
            return false;
        }
        if (text) {
            if (text !== displayTextString) {
                return false;
            }
        }
        return true;
    }
    hasSuggestionChips(...chips) {
        const suggestionChipArray = this.getSuggestionChips();
        if (!suggestionChipArray) {
            return false;
        }
        for (let i = 0; i < chips.length; i++) {
            if (!suggestionChipArray[i] || chips[i] !== suggestionChipArray[i].title) {
                return false;
            }
        }
        return true;
    }
    getMediaResponse() {
        const items = _get(this, 'richResponse.items');
        for (let i = 0; i < items.length; i++) {
            if (items[i].mediaResponse) {
                return items[i].mediaResponse;
            }
        }
    }
    hasMediaResponse(url, name) {
        const mediaResponseObject = this.getMediaResponse();
        if (!mediaResponseObject) {
            return false;
        }
        if (url) {
            if (url !== mediaResponseObject.mediaObjects[0].contentUrl) {
                return false;
            }
        }
        if (name) {
            if (name !== mediaResponseObject.mediaObjects[0].name) {
                return false;
            }
        }
        return true;
    }
    getSpeech() {
        if (!_get(this, 'richResponse.items[0].simpleResponse.ssml')) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'richResponse.items[0].simpleResponse.ssml'));
    }
    getReprompt() {
        if (!_get(this, 'noInputPrompts[0].ssml')) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'noInputPrompts[0].ssml'));
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
    getSessionAttributes() {
        return undefined;
    }
    setSessionAttributes() {
        return this;
    }
    hasSessionAttribute(name, value) {
        return undefined;
    }
    hasState() {
        return undefined;
    }
    hasSessionEnded() {
        return !this.expectUserResponse;
    }
    isTell(speech) {
        if (this.expectUserResponse === true) {
            return false;
        }
        if (speech) {
            if (Array.isArray(speech)) {
                const results = speech.find((text) => {
                    return text === this.getSpeech();
                });
                if (results && results.length === 0) {
                    return false;
                }
            }
            else {
                if (speech.toString() !== this.getSpeech()) {
                    return false;
                }
            }
        }
        return true;
    }
    isAsk(speech, reprompt) {
        if (this.expectUserResponse === false) {
            return false;
        }
        if (speech) {
            if (Array.isArray(speech)) {
                const results = speech.find((text) => {
                    return text === this.getSpeech();
                });
                if (results && results.length === 0) {
                    return false;
                }
            }
            else {
                if (speech.toString() !== this.getSpeech()) {
                    return false;
                }
            }
        }
        if (reprompt) {
            if (Array.isArray(reprompt)) {
                const results = reprompt.find((text) => {
                    return text === this.getReprompt();
                });
                if (results && results.length === 0) {
                    return false;
                }
            }
            else {
                if (reprompt.toString() !== this.getReprompt()) {
                    return false;
                }
            }
        }
        return true;
    }
    toJSON() {
        return Object.assign({}, this);
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, GoogleActionResponse.reviver);
        }
        else {
            const alexaResponse = Object.create(GoogleActionResponse.prototype);
            return Object.assign(alexaResponse, json);
        }
    }
    static reviver(key, value) {
        return key === '' ? GoogleActionResponse.fromJSON(value) : value;
    }
}
exports.GoogleActionResponse = GoogleActionResponse;
//# sourceMappingURL=GoogleActionResponse.js.map