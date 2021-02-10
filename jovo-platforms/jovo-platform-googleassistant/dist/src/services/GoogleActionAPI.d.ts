import { Method } from 'jovo-core';
import { GoogleActionAPIResponse } from './GoogleActionAPIResponse';
export interface ApiCallOptions {
    endpoint: string;
    method?: Method;
    path: string;
    permissionToken?: string;
    json?: any;
}
export declare class GoogleActionAPI {
    static apiCall(options: ApiCallOptions): Promise<GoogleActionAPIResponse>;
}
