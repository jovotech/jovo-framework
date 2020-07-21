import { JWT } from 'google-auth-library';
import { AxiosRequestConfig, ErrorCode, HttpService, JovoError, Method } from 'jovo-core';

import { GoogleServiceAccount } from '../Interfaces';

export class GoogleBusinessAPI {
  static async apiCall(options: ApiCallOptions) {
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

    return HttpService.request(config);
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

export interface ApiCallOptions {
  endpoint: string;
  method?: Method;
  path: string;
  serviceAccount: GoogleServiceAccount;
  data: any; // tslint-disable-line
}
