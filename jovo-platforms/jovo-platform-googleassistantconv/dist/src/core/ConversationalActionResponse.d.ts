import { JovoResponse, SessionData } from 'jovo-core';
import { Card, Device, Expected, Home, Prompt, Scene, Session, User } from './Interfaces';
export interface ConversationalGoogleActionResponseJSON {
    prompt?: Prompt;
    scene?: Scene;
    session?: Session;
    user?: User;
    home?: Home;
    device?: Device;
    metadata?: any;
    expected?: Expected;
    logging?: any;
}
export declare class ConversationalActionResponse implements JovoResponse {
    prompt?: Prompt;
    scene?: Scene;
    session?: Session;
    user?: User;
    home?: Home;
    device?: Device;
    metadata?: any;
    expected?: Expected;
    logging?: any;
    getSessionData(path?: string): undefined;
    hasSessionData(name: string, value?: any): boolean;
    setSessionData(sessionData: SessionData): this;
    getBasicCard(): any;
    hasImageCard(title?: string, content?: string, imageUrl?: string): boolean;
    hasSimpleCard(title?: string, content?: string): boolean;
    getSpeech(): string;
    getReprompt(): string;
    getSpeechPlain(): string | undefined;
    getRepromptPlain(): string | undefined;
    getSessionAttributes(): any;
    getSessionAttribute(name: string): any;
    setSessionAttributes(): this;
    hasSessionAttribute(name: string, value?: any): boolean;
    hasState(): boolean;
    hasSessionEnded(): boolean;
    isTell(speech?: string | string[]): boolean;
    isFirstSimple(speech: string, text: string): boolean;
    isLastSimple(speech: string, text: string): boolean;
    hasBasicCard(card?: Card): boolean;
    isAsk(speech?: string | string[], reprompt?: string | string[]): boolean;
    toJSON(): ConversationalGoogleActionResponseJSON;
    static fromJSON(json: ConversationalGoogleActionResponseJSON | string): any;
    static reviver(key: string, value: any): any;
}
