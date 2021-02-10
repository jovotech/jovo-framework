"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _set = require("lodash.set");
class SapCaiResponse {
    constructor() {
        this.replies = [];
        this.conversation = { memory: {} };
    }
    // of the User to an instance of the class
    static fromJSON(json) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, SapCaiResponse.reviver);
        }
        else {
            // create an instance of the User class
            const response = Object.create(SapCaiResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(response, json);
        }
    }
    // tslint:disable-next-line:no-any
    static reviver(key, value) {
        return key === '' ? SapCaiResponse.fromJSON(value) : value;
    }
    getFirstReply(type) {
        return this.replies.find((item) => {
            return item.type === type;
        });
    }
    getBasicText() {
        return this.getFirstReply('text');
    }
    getBasicCard() {
        return this.getFirstReply('card');
    }
    getQuickReplyCard() {
        return this.getFirstReply('quickReplies');
    }
    hasQuickReplyCard(title, ...chips) {
        const quickReplyCard = this.getQuickReplyCard();
        if (!title ||
            !quickReplyCard ||
            typeof quickReplyCard.content !== 'object' ||
            Array.isArray(quickReplyCard.content) ||
            !quickReplyCard.content.title ||
            !quickReplyCard.content.buttons ||
            !Array.isArray(quickReplyCard.content.buttons) ||
            quickReplyCard.content.title !== title) {
            return false;
        }
        return this.hasAllChipsAsButtons(quickReplyCard.content, chips);
    }
    getButtonsCard() {
        return this.getFirstReply('buttons');
    }
    hasButtonsCard(title, ...chips) {
        const buttonList = this.getButtonsCard();
        if (!title ||
            !buttonList ||
            typeof buttonList.content !== 'object' ||
            Array.isArray(buttonList.content) ||
            !buttonList.content.title ||
            !buttonList.content.buttons ||
            !Array.isArray(buttonList.content.buttons) ||
            buttonList.content.title !== title) {
            return false;
        }
        return this.hasAllChipsAsButtons(buttonList.content, chips);
    }
    getCarouselCard() {
        return this.getFirstReply('carousel');
    }
    hasCarouselCard(...items) {
        const carousel = this.getCarouselCard();
        if (!carousel || typeof carousel.content !== 'object' || !Array.isArray(carousel.content)) {
            return false;
        }
        const hasInvalidItems = items.some((item, index) => {
            const content = carousel.content;
            const hasInvalidButtons = item.buttons
                ? item.buttons.some((button, i) => {
                    return !content[index].buttons || button.title !== content[index].buttons[i].title;
                })
                : false;
            return (!content[index] ||
                item.title !== content[index].title ||
                item.subtitle !== content[index].subtitle ||
                item.imageUrl !== content[index].imageUrl ||
                hasInvalidButtons);
        });
        return !hasInvalidItems;
    }
    getListCard() {
        return this.getFirstReply('list');
    }
    hasListCard(elements, buttonChips) {
        const list = this.getListCard();
        if (!list || typeof list.content !== 'object') {
            return false;
        }
        const hasInvalidElement = elements.some((element, index) => {
            const content = list.content;
            const hasInvalidButtons = element.buttons
                ? element.buttons.some((button, i) => {
                    return (!content.elements[index].buttons ||
                        button.title !== content.elements[index].buttons[i].title);
                })
                : false;
            return ((content.elements && !content.elements[index]) ||
                element.title !== content.elements[index].title ||
                element.subtitle !== content.elements[index].subtitle ||
                element.imageUrl !== content.elements[index].imageUrl ||
                hasInvalidButtons);
        });
        if (buttonChips) {
            const validChips = this.hasAllChipsAsButtons(list.content, buttonChips);
            if (!validChips) {
                return false;
            }
        }
        return !hasInvalidElement;
    }
    getImageCard() {
        return this.getFirstReply('picture');
    }
    hasImageCard(pictureUrl) {
        const card = this.getImageCard();
        if (!card) {
            return false;
        }
        if (!pictureUrl || !card.content || card.content !== pictureUrl) {
            return false;
        }
        return true;
    }
    hasStandardCard(title, subtitle, imageUrl) {
        const basicCardObject = this.getBasicCard();
        if (!basicCardObject || typeof basicCardObject.content !== 'object') {
            return false;
        }
        const content = basicCardObject.content;
        const hasInvalidData = (title && title !== content.title) ||
            (subtitle && subtitle !== content.subtitle) ||
            (imageUrl && imageUrl !== content.imageUrl);
        return !hasInvalidData;
    }
    getSessionData(path) {
        if (path) {
            return this.getSessionAttribute(path);
        }
        else {
            return this.getSessionAttributes();
        }
    }
    // tslint:disable-next-line:no-any
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    getSessionAttributes() {
        return _get(this, 'conversation.memory');
    }
    setSessionAttributes(sessionData) {
        _set(this, 'conversation.memory', sessionData);
        return this;
    }
    getSpeech() {
        return undefined;
    }
    getReprompt() {
        return undefined;
    }
    getSpeechPlain() {
        return undefined;
    }
    getRepromptPlain() {
        return undefined;
    }
    getSessionAttribute(name) {
        return _get(this, `conversation.memory.${name}`);
    }
    // tslint:disable-next-line:no-any
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
    hasState(state) {
        return this.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, state);
    }
    hasSessionEnded() {
        return true;
    }
    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText) {
        if (speechText) {
            const basicText = this.getBasicText();
            const ssml = basicText ? basicText.content : '';
            if (Array.isArray(speechText)) {
                for (const speechTextElement of speechText) {
                    if (speechTextElement === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return ssml === speechText;
            }
        }
        return true;
    }
    isAsk(speechText, repromptText) {
        return false;
    }
    // fromJSON is used to convert an serialized version
    toJSON() {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    hasAllChipsAsButtons(content, chips) {
        return !chips.some((chip, index) => {
            return !content.buttons[index] || chip !== content.buttons[index].title;
        });
    }
}
exports.SapCaiResponse = SapCaiResponse;
//# sourceMappingURL=SapCaiResponse.js.map