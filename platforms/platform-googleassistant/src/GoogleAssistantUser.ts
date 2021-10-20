import { axios, JovoUser } from '@jovotech/framework';
import { JovoError } from '@jovotech/common';

import { AccountLinkingStatus, UserVerificationStatus } from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAccountProfile } from './interfaces';
import _set from 'lodash.set';

export class GoogleAssistantUser extends JovoUser<GoogleAssistant> {
  get id(): string | undefined {
    return this.jovo.$request.user?.params?._GOOGLE_ASSISTANT_USER_ID_ as string | undefined;
  }

  get accessToken(): string | undefined {
    const headers = this.jovo.$server.getRequestHeaders();
    return headers.authorization as string;
  }

  isAccountLinked(): boolean {
    return this.jovo.$request.user?.accountLinkingStatus === AccountLinkingStatus.Linked;
  }

  isVerified(): boolean {
    return this.jovo.$request.user?.verificationStatus === UserVerificationStatus.Verified;
  }

  // TODO: determine whether a method or setter is better
  setId(id: string | undefined): void {
    _set(this.jovo.$request, 'user.params._GOOGLE_ASSISTANT_USER_ID_', id);
  }

  async getGoogleProfile(): Promise<GoogleAccountProfile> {
    const headers = this.jovo.$server.getRequestHeaders();
    const token = headers.authorization as string;

    if (!token) {
      throw new JovoError({
        message: 'No valid authorization token found.',
        hint: 'Make sure the authorization flow was completed.',
        // TODO: Docs link
        learnMore: '',
      });
    }

    try {
      const response = await axios.get<GoogleAccountProfile>(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
      );
      return response.data;
    } catch (error) {
      throw new JovoError({ message: error.message });
    }
  }
}
