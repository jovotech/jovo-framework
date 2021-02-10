import { AxiosRequestConfig, AxiosResponse } from 'axios';
export * from 'axios';
export declare class HttpService {
    static request<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(config: AxiosRequestConfig): Promise<RESPONSE>;
    static get<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(url: string, config?: AxiosRequestConfig): Promise<RESPONSE>;
    static delete<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(url: string, config?: AxiosRequestConfig): Promise<RESPONSE>;
    static head<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(url: string, config?: AxiosRequestConfig): Promise<RESPONSE>;
    static post<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RESPONSE>;
    static put<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RESPONSE>;
    static patch<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RESPONSE>;
}
