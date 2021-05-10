import { axios, AxiosResponse, JovoError } from '@jovotech/framework';
import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';
import { JWT } from 'google-auth-library';
import { GOOGLE_BUSINESS_API_BASE_URL, LATEST_GOOGLE_BUSINESS_API_VERSION } from './constants';
import { GoogleServiceAccount } from './interfaces';

export interface GoogleBusinessApiSendResponseOptions {
  conversationId: string;
  accessToken: string;
  data: GoogleBusinessResponse;
}

export class GoogleBusinessApi {
  static async sendResponse(
    options: GoogleBusinessApiSendResponseOptions,
  ): Promise<AxiosResponse<GoogleBusinessResponse>> {
    const url = `${GOOGLE_BUSINESS_API_BASE_URL}/${LATEST_GOOGLE_BUSINESS_API_VERSION}/conversations/${options.conversationId}/messages`;
    return axios.post(url, options.data, {
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
      },
    });
  }

  static async getAccessToken(serviceAccount: GoogleServiceAccount): Promise<string> {
    const jwtClient = new JWT(serviceAccount.client_email, undefined, serviceAccount.private_key, [
      'https://www.googleapis.com/auth/businessmessages',
    ]);
    const token = await jwtClient.authorize();
    if (!token.access_token) {
      throw new JovoError({
        message: 'Could not retrieve access token.',
      });
    }
    return token.access_token;
  }
}
