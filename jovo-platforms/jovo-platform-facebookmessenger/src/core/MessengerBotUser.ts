import { ErrorCode, HttpService, JovoError, User } from 'jovo-core';
import { UserProfile } from '../Interfaces';
import { MessengerBot } from './MessengerBot';
export class MessengerBotUser extends User {
  profile?: UserProfile;

  constructor(private readonly messengerBot: MessengerBot) {
    super(messengerBot);
  }

  getId(): string | undefined {
    return this.messengerBot.$request!.getUserId();
  }

  async fetchProfile(fields?: string): Promise<UserProfile> {
    try {
      const fieldsValue = fields || this.messengerBot.$app.config.userProfileFields;
      const url = `https://graph.facebook.com/${this.getId()}?fields=${fieldsValue}&access_token=${
        this.messengerBot.$app.config.plugin!.FacebookMessenger!.pageAccessToken
      }`;
      const response = await HttpService.get<UserProfile>(url);
      if (response.status === 200 && response.data) {
        return response.data;
      }

      throw new Error(
        `Could not retrieve user profile. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN);
    }
  }

  async fetchAndSetProfile(fields?: string) {
    this.profile = await this.fetchProfile(fields);
  }
}
