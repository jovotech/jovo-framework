import { axios, JovoError, JovoUser } from '@jovotech/framework';
import { AccountLinkingStatus, UserVerificationStatus } from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAccountProfile } from './interfaces';

export class GoogleAssistantUser extends JovoUser<GoogleAssistant> {
  get id(): string {
    return (
      (this.jovo.$request.user?.params as Record<'userId' | string, string> | undefined)?.userId ||
      'GoogleAssistantUser'
    );
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
