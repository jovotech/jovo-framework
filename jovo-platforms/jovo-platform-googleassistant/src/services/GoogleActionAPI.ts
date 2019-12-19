import { AxiosRequestConfig, HttpService, Method } from 'jovo-core';
import { GoogleActionAPIResponse } from './GoogleActionAPIResponse';
import { GoogleActionAPIError } from './GoogleActionAPIError';

export interface ApiCallOptions {
  endpoint: string;
  method?: Method;
  path: string;
  permissionToken?: string;
  json?: any; // tslint:disable-line
}

export class GoogleActionAPI {
  /**
   *
   * @param {ApiCallOptions} options
   * @returns {Promise<any>}
   */
  static async apiCall(options: ApiCallOptions) {
    const url = options.endpoint + options.path;
    const config: AxiosRequestConfig = {
      data: options.json,
      url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.permissionToken}`,
      },
    };

    const response = await HttpService.request(config);

    if (response.status !== 204 && response.data) {
      return new GoogleActionAPIResponse(response.status, response.data);
    }

    return new GoogleActionAPIResponse(response.status, {});
  }
}
