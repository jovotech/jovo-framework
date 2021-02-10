import { Method, SpeechBuilder, AxiosResponse } from 'jovo-core';
import { AuthorizationResponse } from '../modules/ProactiveEvent';
export interface ApiErrorData {
    message: string;
    code: string;
}
export interface ApiCallOptions {
    endpoint: string;
    method?: Method;
    path: string;
    permissionToken?: string;
    json?: any;
}
export declare class AlexaAPI {
    /**
     * @param {ApiCallOptions} options
     * @returns {Promise<AxiosResponse<T | ApiErrorData>>>}
     */
    static apiCall<T = any>(options: ApiCallOptions): Promise<AxiosResponse<T | ApiErrorData>>;
    static progressiveResponse(speech: string | SpeechBuilder, requestId: string, apiEndPoint: string, apiAccessToken: string): Promise<void>;
    /**
     * TODO
     * Proactive Events Authorization API call
     */
    static proactiveEventAuthorization(clientId: string, clientSecret: string): Promise<AuthorizationResponse>;
}
