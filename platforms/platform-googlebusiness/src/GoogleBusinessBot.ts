import {
  BaseOutput,
  DeepPartial,
  Jovo,
  JovoError,
  OutputConstructor,
  OutputTemplateConverter,
} from '@jovotech/framework';
import {
  GoogleBusinessOutputTemplateConverterStrategy,
  GoogleBusinessResponse,
} from '@jovotech/output-googlebusiness';
import { GoogleBusinessApi } from './GoogleBusinessApi';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
import { GoogleServiceAccount } from './interfaces';

export class GoogleBusinessBot extends Jovo<GoogleBusinessRequest, GoogleBusinessResponse> {
  get conversationId(): string | undefined {
    return this.$request.conversationId;
  }

  get serviceAccount(): GoogleServiceAccount | undefined {
    return this.$handleRequest.plugins?.GoogleBusiness?.config?.serviceAccount;
  }

  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<
      OUTPUT,
      GoogleBusinessRequest,
      GoogleBusinessResponse,
      this
    >,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    await super.$send(outputConstructor, options);
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

    const accessToken = await GoogleBusinessApi.getAccessToken(this.serviceAccount);
    if (Array.isArray(response)) {
      for (const responseItem of response) {
        await GoogleBusinessApi.sendResponse({
          conversationId,
          accessToken,
          data: responseItem,
        });
      }
    } else if (response) {
      await GoogleBusinessApi.sendResponse({
        conversationId,
        accessToken,
        data: response,
      });
    }
  }
}
