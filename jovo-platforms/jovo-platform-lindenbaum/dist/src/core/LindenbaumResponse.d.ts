import { JovoResponse, SessionData } from 'jovo-core';
export declare class LindenbaumResponse implements JovoResponse {
    static fromJSON(json: string): LindenbaumResponse;
    /**
     * array of responses. Each response has its API path as the key and the API request's body
     * as the value. See `SayResponse` for reference
     */
    responses: any[];
    constructor();
    getSpeech(): string | undefined;
    getSpeechPlain(): string | undefined;
    /**
     * Lindenbaum doesn't support reprompts
     */
    getReprompt(): undefined;
    getRepromptPlain(): undefined;
    /**
     * There are no session attributes stored in the Lindenbaum response.
     * always returns `undefined`
     */
    getSessionAttributes(): undefined;
    setSessionAttributes(sessionAttributes: SessionData): this;
    /**
     * There are no session attributes stored in the Lindenbaum response.
     * always returns `undefined`
     */
    getSessionData(): undefined;
    /**
     * There are no session attributes stored in the Lindenbaum response.
     * always returns `undefined`
     */
    setSessionData(sessionData: SessionData): this;
    hasState(state: string): boolean;
    hasSessionData(name: string, value?: any): boolean;
    hasSessionAttribute(name: string, value?: any): boolean;
    isTell(speechText?: string | string[]): boolean;
    isAsk(speechText?: string | string[]): boolean;
    hasSessionEnded(): boolean;
}
export interface SayResponse {
    '/call/say': {
        dialogId: string;
        text: string;
        language: string;
        bargeIn: boolean;
    };
}
export interface DropResponse {
    '/call/drop': {
        dialogId: string;
    };
}
export interface BridgeResponse {
    '/call/bridge': {
        dialogId: string;
        headNumber: string;
        extensionLength: number;
    };
}
export interface ForwardResponse {
    '/call/forward': {
        dialogId: string;
        destinationNumber: string;
    };
}
/**
 * send data to the call, used in Dialog API
 * (https://app.swaggerhub.com/apis/Lindenbaum-GmbH/CVP-Dialog-API/1.0.10)
 */
export interface DataResponse {
    '/call/data': {
        dialogId: string;
        key: string;
        value: string;
    };
}
export declare type Responses = SayResponse | DropResponse | BridgeResponse | ForwardResponse | DataResponse;
