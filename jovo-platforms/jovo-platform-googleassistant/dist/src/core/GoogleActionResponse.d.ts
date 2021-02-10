import { JovoResponse, SessionData } from 'jovo-core';
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
export declare class GoogleActionResponse implements JovoResponse {
    expectUserResponse?: boolean;
    richResponse?: RichResponse;
    noInputPrompts?: NoInputPrompt[];
    getSessionData(path?: string): undefined;
    hasSessionData(name: string, value?: any): boolean;
    setSessionData(sessionData: SessionData): this;
    getBasicCard(): any;
    hasImageCard(title?: string, content?: string, imageUrl?: string): boolean;
    hasSimpleCard(title?: string, content?: string): boolean;
    getDisplayText(): any;
    getSuggestionChips(): any;
    hasDisplayText(text?: string): boolean;
    hasSuggestionChips(...chips: string[]): boolean;
    getMediaResponse(): any;
    hasMediaResponse(url?: string, name?: string): boolean;
    getSpeech(): string | undefined;
    getReprompt(): string | undefined;
    getSpeechPlain(): string | undefined;
    getRepromptPlain(): string | undefined;
    getSessionAttributes(): any;
    setSessionAttributes(): this;
    hasSessionAttribute(name: string, value?: any): any;
    hasState(): boolean | undefined;
    hasSessionEnded(): boolean;
    isTell(speech?: string | string[]): boolean;
    isAsk(speech?: string | string[], reprompt?: string | string[]): boolean;
    toJSON(): GoogleActionResponseJSON;
    static fromJSON(json: GoogleActionResponseJSON | string): any;
    static reviver(key: string, value: any): any;
}
