import {
  axios,
  AxiosResponse,
  BaseOutput,
  DeepPartial,
  Jovo,
  JovoError,
  OutputConstructor,
  OutputTemplate,
  OutputTemplateConverter,
} from '@jovotech/framework';
import {
  FacebookMessengerOutputTemplateConverterStrategy,
  FacebookMessengerResponse,
} from '@jovotech/output-facebookmessenger';
import { FACEBOOK_API_BASE_URL, LATEST_FACEBOOK_API_VERSION } from './constants';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { SendMessageResult } from './interfaces';

export class FacebookMessenger extends Jovo<FacebookMessengerRequest, FacebookMessengerResponse> {
  get apiVersion(): string {
    return (
      this.$handleRequest.plugins?.FacebookMessengerPlatform?.config?.version ||
      LATEST_FACEBOOK_API_VERSION
    );
  }

  get pageAccessToken(): string | undefined {
    return this.$handleRequest.plugins.FacebookMessengerPlatform?.config?.pageAccessToken;
  }

  async $send(outputTemplate: OutputTemplate | OutputTemplate[]): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<
      OUTPUT,
      FacebookMessengerRequest,
      FacebookMessengerResponse,
      this
    >,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructorOrTemplate:
      | OutputConstructor<OUTPUT, FacebookMessengerRequest, FacebookMessengerResponse, this>
      | OutputTemplate
      | OutputTemplate[],
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    if (typeof outputConstructorOrTemplate === 'function') {
      await super.$send(outputConstructorOrTemplate, options);
    } else {
      await super.$send(outputConstructorOrTemplate);
    }
    if (!this.$output) {
      return;
    }

    const outputConverter = new OutputTemplateConverter(
      new FacebookMessengerOutputTemplateConverterStrategy(),
    );
    let response = await outputConverter.toResponse(this.$output);
    response = await this.$platform.finalizeResponse(response, this);

    if (Array.isArray(response)) {
      for (const responseItem of response) {
        await this.sendResponse(responseItem);
      }
    } else if (response) {
      await this.sendResponse(response);
    }
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
