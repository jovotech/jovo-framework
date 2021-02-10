import { JovoRequest, Inputs, SessionData } from 'jovo-core';
interface Intent {
    name: string;
    displayName: string;
    isFallback: boolean;
}
interface QueryResult {
    queryText: string;
    parameters: any;
    allRequiredParamsPresent: boolean;
    intent: Intent;
    intentDetectionConfidence: number;
    languageCode: string;
    outputContexts?: Context[];
}
export interface OriginalDetectIntentRequest<T extends JovoRequest = JovoRequest> {
    source: string;
    version: string;
    payload: T;
}
export interface DialogflowRequestJSON {
    responseId?: string;
    queryResult?: QueryResult;
    originalDetectIntentRequest?: OriginalDetectIntentRequest;
    session?: string;
}
export interface Context {
    name: string;
    lifespanCount?: number;
    parameters?: {
        [key: string]: any;
    };
}
export declare class DialogflowRequest<T extends JovoRequest = JovoRequest> implements JovoRequest {
    responseId?: string;
    queryResult?: QueryResult;
    originalDetectIntentRequest?: OriginalDetectIntentRequest;
    session?: string;
    constructor(originalRequest: T);
    getDeviceName(): string;
    getSessionId(): string | undefined;
    getSessionData(): SessionData;
    setSessionData(sessionData: SessionData): this;
    addSessionData(key: string, value: any): this;
    getAccessToken(): string;
    getLocale(): string;
    getTimestamp(): string;
    getUserId(): string;
    isNewSession(): boolean;
    getIntentName(): string;
    setUserId(userId: string): this;
    /**
     * Returns session context of request
     */
    getSessionContext(): Context | undefined;
    /**
     * Returns ask context of request
     */
    getAskContext(): Context | undefined;
    toJSON(): DialogflowRequestJSON;
    static fromJSON(json: DialogflowRequestJSON | string): DialogflowRequest;
    static reviver(key: string, value: any): any;
    addInput(key: string, value: string): this;
    setIntentName(intentName: string): this;
    addSessionAttribute(key: string, value: any): this;
    getInputs(): Inputs;
    setInputs(inputs: Inputs): this;
    getState(): any;
    getSessionAttributes(): SessionData;
    setSessionAttributes(attributes: SessionData): this;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    setAccessToken(accessToken: string): this;
    setAudioInterface(): this;
    setLocale(locale: string): this;
    setNewSession(isNew: boolean): this;
    setScreenInterface(): this;
    setVideoInterface(): this;
    setState(state: string): this;
    setTimestamp(timestamp: string): this;
    setParameter(key: string, value: string): this;
    getParameters(): any;
}
export {};
