import { axios, AxiosResponse, Jovo, JovoError, OutputTemplate } from '@jovotech/framework';
import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
import { FACEBOOK_API_BASE_URL, LATEST_FACEBOOK_API_VERSION } from './constants';
import { FacebookMessengerDevice } from './FacebookMessengerDevice';
import { FacebookMessengerPlatform } from './FacebookMessengerPlatform';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { SendMessageResult } from './interfaces';

export class FacebookMessenger extends Jovo<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerUser,
  FacebookMessengerDevice,
  FacebookMessengerPlatform
> {
  get apiVersion(): string {
    return (
      this.$handleRequest.config.plugin?.FacebookMessengerPlatform?.version ||
      LATEST_FACEBOOK_API_VERSION
    );
  }

  get pageAccessToken(): string | undefined {
    return this.$handleRequest.config.plugin?.FacebookMessengerPlatform?.pageAccessToken;
  }

  protected sendResponse(
    response: FacebookMessengerResponse,
  ): Promise<AxiosResponse<SendMessageResult>> {
    if (!this.pageAccessToken) {
      throw new JovoError({
        message: 'Can not send message to Facebook due to a missing or empty page-access-token.',
      });
    }
    // TODO: AttachmentMessage-support
    const url = `${FACEBOOK_API_BASE_URL}/${this.apiVersion}/me/messages?access_token=${this.pageAccessToken}`;
    return axios.post<SendMessageResult>(url, response);
  }
}
