import {
  BaseOutput,
  DeepPartial,
  Jovo,
  JovoError,
  OutputConstructor,
  OutputTemplate,
  OutputTemplateConverter,
} from '@jovotech/framework';
import {
  GoogleBusinessOutputTemplateConverterStrategy,
  GoogleBusinessResponse,
} from '@jovotech/output-googlebusiness';
import { JWTInput } from 'google-auth-library';
import { GOOGLE_BUSINESS_API_BASE_URL, LATEST_GOOGLE_BUSINESS_API_VERSION } from './constants';
import { GoogleBusiness } from './GoogleBusiness';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export class GoogleBusinessBot extends Jovo<GoogleBusinessRequest, GoogleBusinessResponse> {
  get conversationId(): string | undefined {
    return this.$request.conversationId;
  }

  get serviceAccount(): JWTInput | undefined {
    return this.$handleRequest.plugins?.GoogleBusiness?.config?.serviceAccount;
  }

  hasScreenInterface(): boolean {
    return true;
  }

  async $send(outputTemplate: OutputTemplate | OutputTemplate[]): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<
      OUTPUT,
      GoogleBusinessRequest,
      GoogleBusinessResponse,
      this
    >,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructorOrTemplate:
      | OutputConstructor<OUTPUT, GoogleBusinessRequest, GoogleBusinessResponse, this>
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
      new GoogleBusinessOutputTemplateConverterStrategy(),
    );
    let response = await outputConverter.toResponse(this.$output);
    response = await this.$platform.finalizeResponse(response, this);

    const conversationId = this.conversationId;
    if (!conversationId) {
      throw new JovoError({
        message:
          'Can not send message to GoogleBusiness due to a missing or empty conversation-id.',
      });
    }
    if (!this.serviceAccount) {
      throw new JovoError({
        message:
          'Can not send message to GoogleBusiness due to a missing or invalid service-account.',
      });
    }

    if (Array.isArray(response)) {
      for (const responseItem of response) {
        await this.sendResponse(conversationId, responseItem);
      }
    } else if (response) {
      await this.sendResponse(conversationId, response);
    }
  }

  private sendResponse(conversationId: string, response: GoogleBusinessResponse) {
    const url = `${GOOGLE_BUSINESS_API_BASE_URL}/${LATEST_GOOGLE_BUSINESS_API_VERSION}/conversations/${conversationId}/messages`;
    return (this.$platform as GoogleBusiness).jwtClient.request<GoogleBusinessResponse>({
      url,
      method: 'POST',
      data: response,
    });
  }
}
