import { Method } from 'jovo-core';
import { BaseResponse, GoogleServiceAccount } from '../Interfaces';
export interface ApiCallOptions {
    endpoint: string;
    method?: Method;
    path: string;
    serviceAccount: GoogleServiceAccount;
    data: BaseResponse;
}
export interface SendResponseOptions<T extends BaseResponse> {
    sessionId: string;
    serviceAccount: GoogleServiceAccount;
    data: T;
}
export declare class GoogleBusinessAPI {
    static sendResponse<T extends BaseResponse = BaseResponse>({ data, sessionId, serviceAccount, }: SendResponseOptions<T>): Promise<import("axios").AxiosResponse<T>>;
    static apiCall<T = any>(options: ApiCallOptions): Promise<import("axios").AxiosResponse<T>>;
    static getApiAccessToken(serviceAccount: GoogleServiceAccount): Promise<string | null | undefined>;
}
