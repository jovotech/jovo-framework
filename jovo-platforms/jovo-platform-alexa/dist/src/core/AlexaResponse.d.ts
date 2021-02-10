import { JovoResponse, SessionData } from 'jovo-core';
export interface SessionAttributes {
    [key: string]: any;
}
export interface Directive {
    type: string;
    updatedIntent?: object;
    slotToElicit?: string;
    updateBehavior?: 'CLEAR' | 'REPLACE';
    types?: DynamicEntityType[];
}
export interface DynamicEntityType {
    name: string;
    values: Array<{
        id?: string;
        name?: {
            value: string;
            synonyms?: string[];
        };
    }>;
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
export declare class AlexaResponse implements JovoResponse {
    version: string;
    response: Response;
    sessionAttributes?: SessionAttributes;
    constructor();
    getCard(): any;
    getDirectives(): any;
    getDirective(directiveType?: string): any;
    getAplDirective(): any;
    hasAplDirective(): boolean;
    getApltDirective(): any;
    hasApltDirective(): boolean;
    getDisplayDirective(): any;
    hasDisplayDirective(): boolean;
    getAudioDirective(): any;
    hasAudioDirective(): boolean;
    getVideoDirective(): any;
    hasVideoDirective(): boolean;
    getSessionData(path?: string): any;
    hasSessionData(name: string, value?: any): boolean;
    setSessionData(sessionData: SessionData): this;
    getSessionAttributes(): this["sessionAttributes"];
    setSessionAttributes(sessionData: SessionData): this;
    getSpeech(): string | undefined;
    getReprompt(): string | undefined;
    getSpeechPlain(): string | undefined;
    getRepromptPlain(): string | undefined;
    getSessionAttribute(name: string): any;
    /**
     *
     * @param {string} name
     * @param {any} value
     * @return {boolean}
     */
    hasSessionAttribute(name: string, value?: any): boolean;
    hasState(state: string): boolean;
    hasSessionEnded(): any;
    /**
     * Checks if response object contains a simple card.
     * @param {string} title
     * @param {string} text
     * @return {boolean}
     */
    hasSimpleCard(title?: string, text?: string): boolean;
    /**
     * Checks if response object contains a standard card.
     * @param {string} title
     * @param {string} text
     * @param {string} smallImageUrl
     * @param {string} largeImageUrl
     * @return {boolean}
     */
    hasStandardCard(title?: string, text?: string, smallImageUrl?: string, largeImageUrl?: string): boolean;
    /**
     * Checks if response object contains a LinkAccount card.
     * @return {boolean}
     */
    hasLinkAccountCard(): boolean;
    /**
     * Checks if response object contains a ask for address card.
     * @return {boolean}
     */
    hasAskForAddressCard(): boolean;
    /**
     * Checks if response object contains a ask for country and postal code card.
     * @return {boolean}
     */
    hasAskForCountryAndPostalCodeCard(): boolean;
    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText?: string | string[]): boolean;
    isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean;
    /**
     * Checks if response is a dialog directive response.
     * @param {'Dialog.Delegate' | 'Dialog.ElicitSlot' |'Dialog.ConfirmIntent' | 'Dialog.ConfirmSlot'} type
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDirective(type: 'Dialog.Delegate' | 'Dialog.ElicitSlot' | 'Dialog.ConfirmIntent' | 'Dialog.ConfirmSlot', updatedIntent: object): boolean;
    /**
     * Checks if response is a dialog delegate response.
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDelegate(updatedIntent: object): boolean;
    /**
     * Checks if response is a dialog elicit slot response.
     * @param {string} slotToElicit
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogElicitSlot(slotToElicit: string, speechText: string, repromptSpeech: string, updatedIntent: object): boolean;
    /**
     * Checks if response is a dialog confirm slot response.
     * @param {string} slotToConfirm
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmSlot(slotToConfirm: string, speechText: string, repromptSpeech: string, updatedIntent: object): boolean;
    /**
     * Checks if response is a dialog confirm intent response.
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmIntent(speechText: string, repromptSpeech: string, updatedIntent: object): boolean;
    toJSON(): AlexaResponseJSON;
    static fromJSON(json: AlexaResponseJSON | string): any;
    static reviver(key: string, value: any): any;
}
