import { JovoRequest, SessionData, Inputs, Input } from 'jovo-core';
export interface AutopilotInputs extends Inputs {
    [key: string]: AutopilotInput;
}
export interface AutopilotInput extends Input {
    type?: string;
}
export interface AutopilotRequestJSON {
    AccountSid?: string;
    AssistantSid?: string;
    DialogueSid?: string;
    UserIdentifier?: string;
    CurrentInput?: string;
    CurrentTask?: string;
    DialoguePayloadUrl?: string;
    Memory?: {
        [key: string]: any;
    };
    Channel?: string;
    CurrentTaskConfidence?: string;
    NextBestTask?: string;
    [key: string]: any;
}
export declare class AutopilotRequest implements JovoRequest {
    AccountSid?: string;
    AssistantSid?: string;
    DialogueSid?: string;
    UserIdentifier?: string;
    CurrentInput?: string;
    CurrentTask?: string;
    DialoguePayloadUrl?: string;
    Memory?: string;
    Channel?: string;
    CurrentTaskConfidence?: string;
    NextBestTask?: string;
    [key: string]: any;
    getUserId(): string;
    getRawText(): string;
    getTimestamp(): string;
    getDeviceName(): string | undefined;
    getAccessToken(): string | undefined;
    getLocale(): string;
    isNewSession(): boolean;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    getSessionAttributes(): SessionData;
    addSessionAttribute(key: string, value: any): this;
    getSessionData(): SessionData;
    addSessionData(key: string, value: any): this;
    setTimestamp(timestamp: string): this;
    setLocale(locale: string): this;
    setUserId(userId: string): this;
    setAccessToken(accessToken: string): this;
    setNewSession(isNew: boolean): this;
    setAudioInterface(): this;
    setScreenInterface(): this;
    setVideoInterface(): this;
    setSessionAttributes(attributes: SessionData): this;
    setSessionData(sessionData: SessionData): this;
    setState(state: string): this;
    getIntentName(): string;
    getCurrentTaskConfidence(): string;
    getNextBestTask(): string;
    setIntentName(intentName: string): this;
    setSessionId(id: string): this;
    setNextBestTask(task: string): this;
    setCurrentTaskConfidence(confidence: string): this;
    getInputs(): AutopilotInputs;
    addInput(key: string, value: string | AutopilotInput): this;
    getState(): string | undefined;
    setInputs(inputs: AutopilotInputs): this;
    getSessionId(): string | undefined;
    toJSON(): AutopilotRequestJSON;
    static fromJSON(json: AutopilotRequestJSON | string): AutopilotRequest;
}
