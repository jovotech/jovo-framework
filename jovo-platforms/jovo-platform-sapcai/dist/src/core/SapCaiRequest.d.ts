import { Input, Inputs, JovoRequest, SessionData } from 'jovo-core';
import { EntityValue, Message } from './Interfaces';
export interface SapCaiInput extends Input {
    caiSkill: {
        raw?: string;
        confidence: number;
        source?: string;
    };
}
export interface Intent {
    slug?: string;
    confidence?: number;
    description?: string;
}
export interface Entity {
    scalar?: number;
    raw?: string;
    confidence?: number;
}
export interface NLP {
    uuid?: string;
    intents?: Intent[];
    entities?: Record<string, Entity>;
    language?: string;
    processing_language?: string;
    timestamp?: string;
    status?: number;
    source?: string;
    act?: string;
    type?: string;
    sentiment?: string;
}
export interface Conversation {
    id?: string;
    language?: string;
    memory?: Record<string, any>;
    skill?: string;
    skill_occurences?: number;
}
export interface SapCaiRequestJSON {
    nlp?: NLP;
    qna?: Record<string, any>;
    messages?: Message[];
    conversation?: Conversation;
    hasDelay?: boolean;
    hasNextMessage?: boolean;
}
export declare class SapCaiRequest implements JovoRequest {
    nlp?: NLP;
    qna?: Record<string, any>;
    messages?: Message[];
    conversation?: Conversation;
    hasDelay?: boolean;
    hasNextMessage?: boolean;
    static fromJSON(json: SapCaiRequestJSON | string): SapCaiRequest;
    static reviver(key: string, value: any): any;
    getSessionId(): string | undefined;
    getAccessToken(): undefined;
    getEntityValue(input: any, type: string): EntityValue;
    getMemoryInputMeta(memoryInput: any, entities: Record<string, any>): any;
    getInputs(): Inputs;
    setInputs(inputs: Inputs): this;
    getLocale(): string;
    getLanguage(): string;
    getSessionData(): any;
    getState(): any;
    setSessionData(sessionData: SessionData): this;
    addSessionData(key: string, value: any): this;
    getSessionAttributes(): any;
    getTimestamp(): any;
    getUserId(): any;
    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface(): boolean;
    /**
     * Returns video capability of request device
     * @return {boolean}
     */
    hasVideoInterface(): boolean;
    isNewSession(): any;
    setLocale(locale: string): this;
    setScreenInterface(): this;
    setVideoInterface(): this;
    setSessionAttributes(attributes: SessionData): this;
    addSessionAttribute(key: string, value: any): this;
    setUserId(userId: string): this;
    setAccessToken(accessToken: string): this;
    setNewSession(isNew: boolean): this;
    setTimestamp(timestamp: string): this;
    /**
     * Sets sessionId for the request
     * @param sessionId
     */
    setSessionId(sessionId: string): this;
    setAudioInterface(): this;
    setState(state: string): this;
    addInput(key: string, value: string | object): this;
    toJSON(): SapCaiRequestJSON;
    getIntentName(): any;
    getEntities(): Record<string, any>;
    getEntity(name: string): any[];
    setEntities(entities: Record<string, any>): this;
    setEntity(name: string, value: any[]): this;
    getMemoryInputs(): any[];
    getMemoryInput(name: string): any | undefined;
    setMemoryInputs(entities: any[]): this;
    setMemoryInput(name: string, value: any): this;
    setIntentName(intentName: string): this;
    getDeviceName(): string | undefined;
}
