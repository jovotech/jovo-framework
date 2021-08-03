import { axios, AxiosRequestConfig, Headers, JovoError, JovoUser } from '@jovotech/framework';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAccountProfile } from './interfaces';

export class GoogleAssistantUser extends JovoUser<GoogleAssistant> {
  get id(): string {
    return (
      (this.jovo.$request.user?.params as Record<'userId' | string, string> | undefined)?.userId ||
      'GoogleAssistantUser'
    );
  }

  isAccountLinked(): boolean {
    return this.jovo.$request.user?.accountLinkingStatus === 'LINKED';
  }

  isVerified(): boolean {
    return this.jovo.$request.user?.verificationStatus === 'VERIFIED';
  }

  async getGoogleProfile(): Promise<GoogleAccountProfile> {
    const headers: Headers = this.jovo.$server.getRequestHeaders();
    const token: string = headers.authorization as string;

    if (!token) {
      throw new JovoError({
        message: 'No valid authorization token found.',
        hint: 'Make sure the authorization flow was completed.',
        // TODO: Docs link
        learnMore: '',
      });
    }

    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    };

    try {
      const res = await axios(config);
      return res.data as GoogleAccountProfile;
    } catch (error) {
      throw new JovoError({ message: error.message });
    }
  }
}
