import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { RequestOptions } from 'http';
export * from 'axios';

export class HttpService {
  // tslint:disable-next-line:no-any
  static request<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    config: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.request(config);
  }

  // tslint:disable-next-line:no-any
  static get<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.get(url, config);
  }

  // tslint:disable-next-line:no-any
  static delete<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.delete(url, config);
  }

  // tslint:disable-next-line:no-any
  static head<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.head(url, config);
  }

  // tslint:disable-next-line:no-any
  static post<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    url: string,
    // tslint:disable-next-line:no-any
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.post(url, data, config);
  }

  // tslint:disable-next-line:no-any
  static put<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    url: string,
    // tslint:disable-next-line:no-any
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.put(url, data, config);
  }

  // tslint:disable-next-line:no-any
  static patch<VALUE = any, RESPONSE = AxiosResponse<VALUE>>(
    url: string,
    // tslint:disable-next-line:no-any
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    return axios.patch(url, data, config);
  }
}
