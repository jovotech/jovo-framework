import { JovoResponse, SessionData } from 'jovo-core';
import { CardContent } from '../response';
import { Message } from './Interfaces';
export interface SessionAttributes {
    [key: string]: any;
}
export interface SapCaiResponseJSON {
    replies?: Message[];
    conversation?: ConversationData;
}
export interface ConversationData {
    memory?: SessionAttributes;
}
export declare class SapCaiResponse implements JovoResponse {
    replies: Message[];
    conversation?: ConversationData;
    constructor();
    static fromJSON(json: SapCaiResponseJSON | string): any;
    static reviver(key: string, value: any): any;
    getFirstReply(type: string): Message | undefined;
    getBasicText(): Message | undefined;
    getBasicCard(): Message | undefined;
    getQuickReplyCard(): Message | undefined;
    hasQuickReplyCard(title: string, ...chips: string[]): boolean;
    getButtonsCard(): Message | undefined;
    hasButtonsCard(title: string, ...chips: string[]): boolean;
    getCarouselCard(): Message | undefined;
    hasCarouselCard(...items: CardContent[]): boolean;
    getListCard(): Message | undefined;
    hasListCard(elements: CardContent[], buttonChips: string[]): boolean;
    getImageCard(): Message | undefined;
    hasImageCard(pictureUrl: string): boolean;
    hasStandardCard(title?: string, subtitle?: string, imageUrl?: string): boolean;
    getSessionData(path?: string): any;
    hasSessionData(name: string, value?: any): boolean;
    setSessionData(sessionData: SessionData): this;
    getSessionAttributes(): any;
    setSessionAttributes(sessionData: SessionData): this;
    getSpeech(): undefined;
    getReprompt(): undefined;
    getSpeechPlain(): undefined;
    getRepromptPlain(): undefined;
    getSessionAttribute(name: string): any;
    hasSessionAttribute(name: string, value?: any): boolean;
    hasState(state: string): boolean;
    hasSessionEnded(): boolean;
    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText?: string | string[]): boolean;
    isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean;
    toJSON(): SapCaiResponseJSON;
    private hasAllChipsAsButtons;
}
