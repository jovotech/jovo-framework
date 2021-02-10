"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _isMatch = require("lodash.ismatch");
class ConversationalActionResponse {
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
    getSpeech() {
        const firstSimple = jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'prompt.firstSimple.speech', ''));
        const lastSimple = jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'prompt.lastSimple.speech', ''));
        return `${firstSimple}${lastSimple ? ' ' : ''}${lastSimple}`;
    }
    getReprompt() {
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'session.params._JOVO_SESSION_.reprompts.NO_INPUT1'));
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
        var _a;
        const attributes = Object.assign(Object.assign({}, (_a = this.session) === null || _a === void 0 ? void 0 : _a.params));
        delete attributes._JOVO_SESSION_;
        return attributes;
    }
    getSessionAttribute(name) {
        return this.getSessionAttributes()[name];
    }
    setSessionAttributes() {
        return this;
    }
    hasSessionAttribute(name, value) {
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
    hasState() {
        return this.hasSessionAttribute(jovo_core_1.SessionConstants.STATE);
    }
    hasSessionEnded() {
        return false;
    }
    isTell(speech) {
        var _a;
        if (((_a = this.scene) === null || _a === void 0 ? void 0 : _a.next.name) !== 'actions.scene.END_CONVERSATION') {
            return false;
        }
        if (speech) {
            const ssml = _get(this, 'prompt.firstSimple.speech');
            if (Array.isArray(speech)) {
                for (const speechTextElement of speech) {
                    if (jovo_core_1.SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return ssml === jovo_core_1.SpeechBuilder.toSSML(speech);
            }
        }
        return true;
    }
    isFirstSimple(speech, text) {
        var _a, _b, _c, _d;
        if (speech && ((_b = (_a = this.prompt) === null || _a === void 0 ? void 0 : _a.firstSimple) === null || _b === void 0 ? void 0 : _b.speech) !== speech) {
            return false;
        }
        if (text && ((_d = (_c = this.prompt) === null || _c === void 0 ? void 0 : _c.firstSimple) === null || _d === void 0 ? void 0 : _d.text) !== text) {
            return false;
        }
        return true;
    }
    isLastSimple(speech, text) {
        var _a, _b, _c, _d;
        if (speech && ((_b = (_a = this.prompt) === null || _a === void 0 ? void 0 : _a.lastSimple) === null || _b === void 0 ? void 0 : _b.speech) !== speech) {
            return false;
        }
        if (text && ((_d = (_c = this.prompt) === null || _c === void 0 ? void 0 : _c.lastSimple) === null || _d === void 0 ? void 0 : _d.text) !== text) {
            return false;
        }
        return true;
    }
    hasBasicCard(card) {
        var _a, _b, _c, _d;
        if (!((_b = (_a = this.prompt) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.card)) {
            return false;
        }
        if (card) {
            return _isMatch((_d = (_c = this.prompt) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.card, card);
        }
        return true;
    }
    isAsk(speech, reprompt) {
        var _a;
        if (((_a = this.scene) === null || _a === void 0 ? void 0 : _a.next.name) === 'actions.scene.END_CONVERSATION') {
            return false;
        }
        if (speech) {
            const ssml = _get(this, 'prompt.firstSimple.speech');
            if (Array.isArray(speech)) {
                for (const speechTextElement of speech) {
                    if (jovo_core_1.SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                if (ssml !== jovo_core_1.SpeechBuilder.toSSML(speech)) {
                    return false;
                }
            }
        }
        if (reprompt) {
            const ssml = _get(this, 'session.params._JOVO_SESSION_.reprompts.NO_INPUT1');
            if (Array.isArray(reprompt)) {
                for (const speechTextElement of reprompt) {
                    if (jovo_core_1.SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                if (ssml !== jovo_core_1.SpeechBuilder.toSSML(reprompt)) {
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
            return JSON.parse(json, ConversationalActionResponse.reviver);
        }
        else {
            const alexaResponse = Object.create(ConversationalActionResponse.prototype);
            return Object.assign(alexaResponse, json);
        }
    }
    static reviver(key, value) {
        return key === '' ? ConversationalActionResponse.fromJSON(value) : value;
    }
}
exports.ConversationalActionResponse = ConversationalActionResponse;
//# sourceMappingURL=ConversationalActionResponse.js.map