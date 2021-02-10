import { Inputs, JovoRequest, SessionData } from 'jovo-core';
import { GoogleAssistantDeviceName } from './Interfaces';
interface User {
    userId: string;
    locale: string;
    lastSeen?: string;
    permissions?: string[];
    accessToken?: string;
    profile: {
        displayName: string;
        givenName: string;
        familyName: string;
    };
    userStorage?: any;
}
interface Conversation {
    conversationId: string;
    type: string;
    conversationToken?: string;
}
interface RawInput {
    inputType: string;
    query?: string;
}
interface Extension {
    '@type': string;
    'status': string;
}
interface InputArgument {
    name: string;
    rawText?: string;
    textValue?: string;
    extension?: Extension;
}
interface Input {
    intent?: string;
    rawInputs: RawInput[];
    arguments?: InputArgument[];
}
interface Capability {
    name: string;
}
interface Surface {
    capabilities: Capability[];
}
export interface GoogleActionRequestJSON {
    user?: User;
    conversation?: Conversation;
    inputs?: Input[];
    surface?: Surface;
    isInSandbox?: boolean;
    availableSurfaces?: Surface;
}
export declare class GoogleActionRequest implements JovoRequest {
    user?: User;
    conversation?: Conversation;
    inputs?: Input[];
    surface?: Surface;
    isInSandbox?: boolean;
    availableSurfaces?: Surface;
    getSessionId(): string | undefined;
    getDeviceName(): GoogleAssistantDeviceName;
    getIntentName(): string | undefined;
    getSessionData(): any;
    setSessionData(sessionData: SessionData): this;
    addSessionData(key: string, value: any): this;
    setUserId(userId: string): this;
    toJSON(): GoogleActionRequestJSON;
    static fromJSON(json: GoogleActionRequestJSON | string): GoogleActionRequest;
    static reviver(key: string, value: any): any;
    addInput(key: string, value: string): this;
    addSessionAttribute(key: string, value: any): this;
    getAccessToken(): string;
    getInputs(): any;
    getLocale(): string;
    getSessionAttributes(): any;
    getTimestamp(): string;
    getUserId(): string;
    getUserStorage(): string;
    hasWebBrowserInterface(): boolean;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    isNewSession(): boolean;
    setAccessToken(accessToken: string): this;
    setAudioInterface(): this;
    setLocale(locale: string): this;
    setNewSession(isNew: boolean): this;
    setScreenInterface(): this;
    setSessionAttributes(attributes: any): this;
    setState(state: string): this;
    getState(): undefined;
    setInputs(inputs: Inputs): this;
    setTimestamp(timestamp: string): this;
    setIntentName(intentName: string): this;
    setVideoInterface(): this;
}
export {};
