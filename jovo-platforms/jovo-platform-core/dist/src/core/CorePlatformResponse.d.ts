import { AsrData, JovoResponse, NluData, SessionData } from 'jovo-core';
import { Action, CorePlatformResponseJSON, Version } from '..';
export declare type Data = Record<string, any>;
export declare class CorePlatformResponse implements JovoResponse, CorePlatformResponseJSON {
    static reviver(key: string, value: any): any;
    static fromJSON(json: CorePlatformResponseJSON | string): CorePlatformResponse;
    version: Version;
    actions: Action[];
    reprompts: Action[];
    user: {
        data: Data;
    };
    session: {
        end: boolean;
        data: Data;
    };
    context: {
        request: {
            asr?: AsrData;
            nlu?: NluData;
        };
    };
    constructor();
    getReprompt(): string | undefined;
    getRepromptPlain(): string | undefined;
    getSessionAttributes(): SessionData | undefined;
    getSessionData(): SessionData | undefined;
    getSpeech(): string | undefined;
    getSpeechPlain(): string | undefined;
    hasSessionAttribute(name: string, value?: any): boolean;
    hasSessionData(name: string, value?: any): boolean;
    hasSessionEnded(): boolean;
    hasState(state: string): boolean | undefined;
    isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean;
    isTell(speechText?: string | string[]): boolean;
    setSessionAttributes(sessionAttributes: SessionData): this;
    setSessionData(sessionData: SessionData): this;
    getSessionAttribute(name: string): any;
}
