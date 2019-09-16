import {JovoResponse, SpeechBuilder, SessionConstants, SessionData} from "jovo-core";
import _get = require('lodash.get');
import _set = require('lodash.set');
import { CardContent } from "./response/Card";

export interface SessionAttributes {
    [key: string]: any; //tslint:disable-line
}

export interface SAPCAIResponseJSON {
    replies?: any[];
    conversation?: Conversation;
}

export interface Conversation {
    memory?: SessionAttributes;
}

export class SAPCAIResponse implements JovoResponse {
    replies: any[];
    conversation?: Conversation;

    constructor() {
        this.replies = [];
        this.conversation = { memory : {} };
    }

    getFirstReply(type: string) {
        const items : any[] = _get(this, 'replies');

        for (let i = 0; i < items.length; i++) {
            if (items[i] && items[i].type === type) {
                return items[i];
            }
        }
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

    hasQuickReplyCard(title: string, ...chips: string[]) {
        const quickReplies = this.getQuickReplyCard();

        if (!quickReplies) {
            return false;
        }

        if (!title || !quickReplies.content.title || quickReplies.content.title !== title) {
            return false;
        }

        for (let i = 0; i < chips.length; i++) {
            if (!quickReplies.content.buttons[i] || chips[i] !== quickReplies.content.buttons[i].title) {
                return false;
            }
        }

        return true;
    }

    getButtonsCard() {
        return this.getFirstReply('buttons');
    }

    hasButtonsCard(title: string, ...chips: string[]) {
        const buttonList = this.getButtonsCard();

        if (!buttonList) {
            return false;
        }

        if (!title || !buttonList.content.title || buttonList.content.title !== title) {
            return false;
        }

        for (let i = 0; i < chips.length; i++) {
            if (!buttonList.content.buttons[i] || chips[i] !== buttonList.content.buttons[i].title) {
                return false;
            }
        }

        return true;
    }

    getCarouselCard() {
        return this.getFirstReply('carousel');
    }

    hasCarouselCard(...items: CardContent[]) {
        const carousel = this.getCarouselCard();

        if (!carousel) {
            return false;
        }

        for (let i = 0; i < items.length; i++) {
            if (!carousel.content[i] || items[i].title !== carousel.content[i].title) {
                return false;
            }
            if (!carousel.content[i] || items[i].subtitle !== carousel.content[i].subtitle) {
                return false;
            }
            if (!carousel.content[i] || items[i].imageUrl !== carousel.content[i].imageUrl) {
                return false;
            }
            if (items[i].buttons) {
                for (let j = 0; j < items[i].buttons!.length; j++) {
                    if (!carousel.content[i].buttons || items[i].buttons![j].title !== carousel.content[i].buttons[j].title) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    
    getListCard() {
        return this.getFirstReply('list');
    }

    hasListCard(elements: CardContent[], buttonChips: string[]) {
        const list = this.getListCard();

        if (!list) {
            return false;
        }

        for (let i = 0; i < elements.length; i++) {
            if (!list.content.elements[i] || elements[i].title !== list.content.elements[i].title) {
                return false;
            }
            if (!list.content.elements[i] || elements[i].subtitle !== list.content.elements[i].subtitle) {
                return false;
            }
            if (!list.content.elements[i] || elements[i].imageUrl !== list.content.elements[i].imageUrl) {
                return false;
            }
            if (elements[i].buttons !== undefined) {
                for (let j = 0; j < elements[i].buttons!.length; j++) {
                    if (!list.content.elements[i].buttons || elements[i].buttons![j].title !== list.content.elements[i].buttons[j].title) {
                        return false;
                    }
                }
            }
        }

        if( buttonChips ) {
            for (let i = 0; i < buttonChips.length; i++) {
                if (!list.content.buttons[i] || buttonChips[i] !== list.content.buttons[i].title) {
                    return false;
                }
            }
        }

        return true;
    }
    
    getImageCard() {
        return this.getFirstReply('picture');
    }

    hasImageCard(pictureUrl: string) {
        const card = this.getImageCard();

        if (!card) {
            return false;
        }

        if (!pictureUrl || !card.content || card.content !== pictureUrl) {
            return false;
        }

        return true;
    }

    hasStandardCard(title?: string, subtitle?: string, imageUrl?: string): boolean {
        const basicCardObject = this.getBasicCard();

        if (!basicCardObject){
            return false;
        }

        if (title) {
            if (title !== basicCardObject.content.title) {
                return false;
            }
        }

        if (subtitle) {
            if (subtitle !== basicCardObject.content.subtitle) {
                return false;
            }
        }

        if (imageUrl) {
            if (imageUrl !== basicCardObject.content.imageUrl) {
                return false;
            }
        }

        return true;
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
        return _get(this, 'conversation.memory');
    }

    setSessionAttributes(sessionData: SessionData) {
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

    getSessionAttribute(name: string) {
        return _get(this, `conversation.memory.${name}`);
    }

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
        return true;
    }

    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText?: string | string[]): boolean {
        if (speechText) {
            const ssml:string =  this.getBasicText().content;

            if (Array.isArray(speechText)) {
                for (const speechTextElement of speechText) {
                    if (speechTextElement === ssml) {
                        return true;
                    }
                }
                return false;
            } else {
                return ssml === speechText;
            }
        }
        return true;
    }

    isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
        return false;
    }

    toJSON(): SAPCAIResponseJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: SAPCAIResponseJSON|string) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, SAPCAIResponse.reviver);
        } else {
            // create an instance of the User class
            const sapcaiResponse = Object.create(SAPCAIResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(sapcaiResponse, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { // tslint:disable-line
        return key === "" ? SAPCAIResponse.fromJSON(value) : value;
    }
}
