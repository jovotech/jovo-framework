import { Input, Inputs, JovoRequest, SessionData } from 'jovo-core';
import { GoogleBusinessBaseRequest } from '../Interfaces';
export declare class GoogleBusinessRequest implements JovoRequest {
    static fromJSON(json: GoogleBusinessBaseRequest | string): GoogleBusinessRequest;
    static reviver(key: string, value: any): any;
    agent: string;
    conversationId: string;
    customAgentId: string;
    requestId: string;
    context?: {
        entryPoint: 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS';
        placeId: string;
        userInfo: {
            displayName: string;
        };
    };
    sendTime: string;
    message?: {
        messageId: string;
        name: string;
        text: string;
        createTime: string;
    };
    suggestionResponse?: {
        message: string;
        postbackData: string;
        createTime: string;
        text: string;
        suggestionType: 'UNKNOWN' | 'ACTION' | 'REPLY';
    };
    /**
     * the `nlu` property is only used with the Jovo TestSuite. It is not part of the actual request.
     * It won't be part of any logs.
     */
    nlu?: {
        intentName?: string;
        inputs?: Inputs;
    };
    constructor();
    toJSON(): GoogleBusinessBaseRequest;
    /**
     * Returns the agent identifier.
     */
    getAgent(): string;
    /**
     * Returns the custom agent identifier
     */
    getCustomAgentId(): string;
    /**
     * Return the request ID
     */
    getRequestId(): string;
    getRawText(): string;
    /**
     * Returns the entry point that the user clicked to initiate the conversation.
     *
     * Either `ENTRY_POINT_UNSPECIFIED`, `PLACESHEET`, or `MAPS` if it is defined in the request.
     */
    getEntryPoint(): 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS' | undefined;
    /**
     * Returns the ID from the Google Places database for the location the user messaged.
     */
    getPlaceId(): string | undefined;
    /**
     * Returns the user's display name.
     */
    getUserDisplayName(): string | undefined;
    getDeviceName(): string | undefined;
    getUserId(): string;
    getAccessToken(): string | undefined;
    getLocale(): string;
    isNewSession(): boolean;
    getTimestamp(): string;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    getSessionAttributes(): SessionData;
    getSessionData(): SessionData;
    addSessionAttribute(key: string, value: any): this;
    addSessionData(key: string, value: any): this;
    setTimestamp(timestamp: string): this;
    setLocale(locale: string): this;
    setUserId(userId: string): this;
    setAccessToken(accessToken: string): this;
    setNewSession(isNew: boolean): this;
    setAudioInterface(): this;
    setVideoInterface(): this;
    setScreenInterface(): this;
    setSessionAttributes(attributes: SessionData): this;
    setSessionData(sessionData: SessionData): this;
    setState(state: string): this;
    getIntentName(): string;
    setIntentName(intentName: string): this;
    getInputs(): Inputs;
    addInput(key: string, value: string | Input): this;
    getState(): string | undefined;
    setInputs(inputs: Inputs): this;
    getSessionId(): string;
    setSessionId(id: string): this;
}
