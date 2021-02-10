import { JovoResponse, SessionData } from 'jovo-core';
import { BaseResponse, CarouselCardResponse, StandaloneCardResponse, TextResponse } from '../Interfaces';
export declare class GoogleBusinessResponse implements JovoResponse {
    static fromJSON(json: string): GoogleBusinessResponse;
    response?: TextResponse | StandaloneCardResponse | CarouselCardResponse | BaseResponse;
    getSpeech(): string | undefined;
    getSpeechPlain(): string | undefined;
    getReprompt(): undefined;
    getRepromptPlain(): undefined;
    getSessionAttributes(): SessionData | undefined;
    setSessionAttributes(sessionAttributes: SessionData): this;
    getSessionData(): SessionData | undefined;
    setSessionData(sessionData: SessionData): this;
    hasState(state: string): boolean | undefined;
    hasSessionAttribute(name: string, value?: any): boolean;
    hasSessionData(name: string, value?: any): boolean;
    hasSessionEnded(): boolean;
    isTell(speechText?: string | string[]): boolean;
    isAsk(speechText?: string | string[]): boolean;
}
