import { JovoResponse, SessionData } from 'jovo-core';
import { SessionEntityType } from './Interfaces';
export interface Payload {
    [key: string]: JovoResponse;
}
interface Context {
    name: string;
    lifespanCount?: number;
    parameters?: {
        [key: string]: any;
    };
}
export interface DialogflowResponseJSON {
    fulfillmentText?: string;
    outputContexts?: Context[];
    payload?: Payload;
}
/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */
export declare class DialogflowResponse implements JovoResponse {
    fulfillmentText?: string;
    payload?: Payload;
    outputContexts?: Context[];
    sessionEntityTypes?: SessionEntityType[];
    end_interaction: boolean;
    fulfillmentMessages?: any[];
    getContext(name: string): Context;
    hasContext(name: string): boolean;
    getPlatformId(): string;
    getSessionData(path?: string): any;
    hasSessionData(name: string, value?: any): boolean;
    setSessionData(sessionData: SessionData): this;
    getSessionAttributes(): {
        [key: string]: any;
    };
    getSessionAttribute(path: string): any;
    setSessionAttributes(sessionData: SessionData): this;
    hasSessionEnded(): boolean;
    getSpeech(): string;
    getReprompt(): string;
    getSpeechPlain(): string;
    getRepromptPlain(): string;
    isTell(speech?: string | string[]): boolean;
    isAsk(speech?: string | string[], reprompt?: string | string[]): boolean;
    hasState(state: string): boolean;
    hasSessionAttribute(name: string, value?: any): boolean;
    getPlatformResponse(): JovoResponse;
    toJSON(): DialogflowResponseJSON;
    static fromJSON(json: DialogflowResponseJSON | string): any;
    static reviver(key: string, value: any): any;
}
export {};
