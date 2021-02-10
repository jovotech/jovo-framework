import { JovoRequest, Inputs, SessionData, Input } from 'jovo-core';
export declare class LindenbaumRequest implements JovoRequest {
    static fromJSON(json: LindenbaumRequestJSON | string): LindenbaumRequest;
    /**
     * Depending on the endpoint we have 3 request schemes.
     */
    callback?: string;
    confidence?: number;
    dialogId: string;
    duration?: number;
    language?: string;
    local?: string;
    remote?: string;
    text?: string;
    timestamp: number;
    type?: MessageType;
    /**
     * the `nlu` property is only used with the Jovo TestSuite. It is not part of the actual request.
     * It won't be part of any logs.
     */
    nlu?: {
        intentName?: string;
        inputs?: Inputs;
    };
    constructor();
    getCallbackUrl(): string | undefined;
    getUserId(): string;
    getRawText(): string;
    getTimestamp(): string;
    getDeviceName(): undefined;
    getAccessToken(): undefined;
    getLocale(): string;
    getSessionId(): string;
    getMessageType(): string | undefined;
    getLocal(): string | undefined;
    getRemote(): string | undefined;
    getInputs(): Inputs;
    getSessionAttributes(): SessionData;
    getSessionData(): SessionData;
    getState(): string | undefined;
    getIntentName(): string;
    isNewSession(): boolean;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    setTimestamp(timestamp: string): this;
    setLocale(locale: string): this;
    setUserId(userId: string): this;
    setAccessToken(accessToken: string): this;
    setRawText(text: string): this;
    setConfidence(confidence: number): this;
    setCallbackUrl(url: string): this;
    setLocal(phoneNumber: string): this;
    setRemote(phoneNumber: string): this;
    setAudioInterface(): this;
    setScreenInterface(): this;
    setVideoInterface(): this;
    setInputs(inputs: Inputs): this;
    setIntentName(intentName: string): this;
    setSessionAttributes(attributes: SessionData): this;
    setSessionData(sessionData: SessionData): this;
    setState(state: string): this;
    setNewSession(isNew: boolean): this;
    addInput(key: string, value: string | Input): this;
    addSessionAttribute(key: string, value: any): this;
    addSessionData(key: string, value: any): this;
    toJSON(): LindenbaumRequestJSON;
}
export interface LindenbaumSessionRequestJSON {
    callback: string;
    dialogId: string;
    local: string;
    remote: string;
    timestamp: number;
}
export interface LindenbaumMessageRequestJSON {
    callback: string;
    confidence: number;
    dialogId: string;
    text: string;
    timestamp: number;
    type: MessageType;
}
export interface LindenbaumTerminatedRequestJSON {
    dialogId: string;
    timestamp: number;
}
export interface LindenbaumInactivityRequestJSON {
    dialogId: string;
    timestamp: number;
    duration: number;
    callback: string;
}
declare type MessageType = 'SPEECH' | 'DTMF';
export declare type LindenbaumRequestJSON = LindenbaumSessionRequestJSON | LindenbaumMessageRequestJSON | LindenbaumTerminatedRequestJSON | LindenbaumInactivityRequestJSON;
export {};
