import { JWT } from 'google-auth-library';
import { AxiosRequestConfig, ErrorCode, HttpService, JovoError, Method } from 'jovo-core';

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

export class GoogleBusinessAPI {
  static async sendResponse<T extends BaseResponse = BaseResponse>({
    data,
    sessionId,
    serviceAccount,
  }: SendResponseOptions<T>) {
    const options: ApiCallOptions = {
      data,
      endpoint: 'https://businessmessages.googleapis.com/v1',
      path: `/conversations/${sessionId}/messages`,
      serviceAccount,
    };
    try {
      return this.apiCall<T>(options);
    } catch (e) {
      throw new JovoError(
        'Could not send response!',
        ErrorCode.ERR_PLUGIN,
        this.constructor.name,
        e.response?.data || e.message || e,
        `Status: ${e.response?.status}`,
      );
    }
  }

  static async apiCall<T = any>(options: ApiCallOptions) {
    const token = await this.getApiAccessToken(options.serviceAccount);

    const url = options.endpoint + options.path;
    const config: AxiosRequestConfig = {
      data: options.data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: options.method || 'POST',
      url,
    };

    return HttpService.request<T>(config);
  }

  static async getApiAccessToken(serviceAccount: GoogleServiceAccount) {
    try {
      const jwtClient = new JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/businessmessages'],
        undefined,
      );

      const token = await jwtClient.authorize();
      return token.access_token;
    } catch (e) {
      return Promise.reject(
        new JovoError(e.message, ErrorCode.ERR_PLUGIN, 'jovo-platform-googlebusiness'),
      );
    }
  }
}
