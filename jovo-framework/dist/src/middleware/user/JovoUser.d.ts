import { BaseApp, HandleRequest, Inputs, Output, Plugin, PluginConfig, SessionData, SpeechBuilder } from 'jovo-core';
export interface Config extends PluginConfig {
    columnName?: string;
    implicitSave?: boolean;
    metaData?: MetaDataConfig;
    context?: ContextConfig;
    sessionData?: SessionDataConfig;
    updatedAt?: boolean;
    dataCaching?: boolean;
}
export interface MetaDataConfig {
    enabled?: boolean;
    lastUsedAt?: boolean;
    sessionsCount?: boolean;
    createdAt?: boolean;
    requestHistorySize?: number;
    devices?: boolean;
}
export interface SessionDataConfig {
    enabled?: boolean;
    data?: boolean;
    dataKey?: string;
    id?: boolean;
    expireAfterSeconds?: number;
}
export interface ContextConfig {
    enabled?: boolean;
    prev?: {
        size?: number;
        request?: {
            intent?: boolean;
            state?: boolean;
            inputs?: boolean;
            timestamp?: boolean;
        };
        response?: {
            speech?: boolean;
            reprompt?: boolean;
            state?: boolean;
            output?: boolean;
        };
    };
}
export interface UserContext {
    prev?: ContextPrevObject[];
}
export interface ContextPrevObject {
    request?: {
        timestamp?: string;
        state?: string;
        intent?: string;
        inputs?: Inputs;
    };
    response?: {
        speech?: string | SpeechBuilder;
        reprompt?: string | SpeechBuilder | string[];
        state?: string;
        output?: Output;
    };
}
export interface UserMetaData {
    lastUsedAt?: string;
    sessionsCount?: number;
    createdAt?: string;
    requests?: {
        [key: string]: {
            count: number;
            log: string[];
        };
    };
    devices?: {
        [key: string]: {
            hasAudioInterface: boolean;
            hasScreenInterface: boolean;
            hasVideoInterface: boolean;
        };
    };
}
export interface UserSessionData {
    [key: string]: any;
    $data?: SessionData;
    id?: string;
    lastUpdatedAt?: string;
    isNew?: boolean;
}
export declare class JovoUser implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    loadDb: (handleRequest: HandleRequest, force?: boolean) => Promise<void>;
    saveDb: (handleRequest: HandleRequest, force?: boolean) => Promise<void>;
    /**
     * Caches the current state of the user data hashed inside the jovo object
     * @param {HandleRequest} handleRequest https://www.jovo.tech/docs/plugins#handlerequest
     * @param {object} data user data
     */
    private updateDbLastState;
    /**
     *
     * @param {HandleRequest} handleRequest https://www.jovo.tech/docs/plugins#handlerequest
     * @param {object} data current user data
     */
    private userDataIsEqualToLastState;
    private updateMetaData;
    /**
     * update $metaData.createdAt
     * @param {HandleRequest} handleRequest
     */
    private updateCreatedAt;
    /**
     * update $metaData.lastUsedAt
     * @param {HandleRequest} handleRequest
     */
    private updateLastUsedAt;
    /**
     * update $metaData.sessionsCount
     * @param {HandleRequest} handleRequest
     */
    private updateSessionsCount;
    /**
     * update $metaData.requests
     * @param {HandleRequest} handleRequest
     */
    private updateRequestHistory;
    /**
     * update $metaData.devices
     * @param {HandleRequest} handleRequest
     */
    private updateDevices;
    /**
     * update $user.$context
     * @param {HandleRequest} handleRequest
     */
    private updateContextData;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevSpeech;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevReprompt;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevResponseState;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevTimestamp;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevRequestState;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevInputs;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevIntent;
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevOutput;
    private updateSessionData;
}
