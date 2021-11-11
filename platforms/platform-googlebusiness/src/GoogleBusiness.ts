import { AsyncJovo, JovoError } from '@jovotech/framework';
import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';
import type { GaxiosResponse } from 'gaxios';
import { JWTInput } from 'google-auth-library';
import { GOOGLE_BUSINESS_API_BASE_URL, LATEST_GOOGLE_BUSINESS_API_VERSION } from './constants';
import { GoogleBusinessDevice } from './GoogleBusinessDevice';
import { GoogleBusinessPlatform } from './GoogleBusinessPlatform';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
import { GoogleBusinessUser } from './GoogleBusinessUser';

export class GoogleBusiness extends AsyncJovo<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusiness,
  GoogleBusinessUser,
  GoogleBusinessDevice,
  GoogleBusinessPlatform
> {
  get conversationId(): string | undefined {
    return this.$request.conversationId;
  }

  get serviceAccount(): JWTInput | undefined {
    return this.$config.plugin?.GoogleBusinessPlatform?.serviceAccount;
  }

  protected sendResponse(
    response: GoogleBusinessResponse,
  ): Promise<GaxiosResponse<GoogleBusinessResponse>> {
    if (!this.conversationId) {
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
    const url = `${GOOGLE_BUSINESS_API_BASE_URL}/${LATEST_GOOGLE_BUSINESS_API_VERSION}/conversations/${this.conversationId}/messages`;
    return (this.$platform as GoogleBusinessPlatform).jwtClient.request<GoogleBusinessResponse>({
      url,
      method: 'POST',
      data: response,
    });
  }
}
