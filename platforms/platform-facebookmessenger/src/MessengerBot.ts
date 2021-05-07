import {
  App,
  axios,
  AxiosResponse,
  BaseOutput,
  DeepPartial,
  HandleRequest,
  Jovo,
  JovoError,
  OutputConstructor,
  OutputTemplateConverter,
  Platform,
} from '@jovotech/framework';
import {
  FacebookMessengerOutputTemplateConverterStrategy,
  FacebookMessengerResponse,
} from '@jovotech/output-facebookmessenger';
import { FACEBOOK_API_BASE_URL, LATEST_FACEBOOK_API_VERSION } from './constants';
import { FacebookMessengerConfig } from './FacebookMessenger';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { SendMessageResult } from './interfaces';

export class MessengerBot extends Jovo<FacebookMessengerRequest, FacebookMessengerResponse> {
  get apiVersion(): string {
    return (
      this.$handleRequest.plugins?.FacebookMessenger?.config?.version || LATEST_FACEBOOK_API_VERSION
    );
  }

  get pageAccessToken(): string {
    return this.$handleRequest.plugins.FacebookMessenger?.config?.pageAccessToken || '';
  }

  // TODO implement error-handling
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<
      OUTPUT,
      FacebookMessengerRequest,
      FacebookMessengerResponse,
      this
    >,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    await super.$send(outputConstructor, options);
    if (!this.$output) {
      return;
    }

    const outputConverter = new OutputTemplateConverter(
      new FacebookMessengerOutputTemplateConverterStrategy(),
    );
    let response = await outputConverter.toResponse(this.$output);
    response = await this.$platform.finalizeResponse(response, this);

    if (Array.isArray(response)) {
      const promises = response.map((response) => this.sendResponse(response));
      await Promise.all(promises);
    } else if (response) {
      await this.sendResponse(response);
    }
    // TODO implement sending of responses
  }

  private sendResponse(
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
