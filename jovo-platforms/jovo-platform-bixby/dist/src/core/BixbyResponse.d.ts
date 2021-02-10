import { JovoResponse } from 'jovo-core';
import { Response, SessionData } from './Interfaces';
export declare class BixbyResponse implements JovoResponse {
    _JOVO_SESSION_DATA_?: SessionData;
    _JOVO_SPEECH_?: string;
    _JOVO_TEXT_?: string;
    _JOVO_AUDIO_?: string;
    _JOVO_LAYOUT_?: {
        [key: string]: any;
    };
    static fromJSON(jsonRaw: Response | string): any;
    setSessionId(id: string): this;
    getSessionId(): string | undefined;
    getSpeech(): string | undefined;
    getReprompt(): string | undefined;
    getSpeechPlain(): string | undefined;
    getRepromptPlain(): string | undefined;
    getSessionAttributes(): SessionData | undefined;
    setSessionAttributes(sessionAttributes: SessionData): this;
    getSessionData(): SessionData | undefined;
    setSessionData(sessionData: SessionData): this;
    isTell(speechText?: string | string[] | undefined): boolean;
    isAsk(speechText?: string | string[] | undefined, repromptText?: string | string[] | undefined): boolean;
    hasState(state: string): boolean | undefined;
    getSessionAttribute(key: string): string | undefined;
    hasSessionAttribute(name: string, value?: any): boolean;
    hasSessionData(name: string, value?: any): boolean;
    hasSessionEnded(): boolean;
}
