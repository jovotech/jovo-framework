import { ErrorCode, HttpService, JovoError, Log, User } from 'jovo-core';
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

  async fetchProfile(fields?: string): Promise<UserProfile | undefined> {
    const fieldsValue = fields || this.messengerBot.$config.userProfileFields;
    const pageAccessToken = this.messengerBot.$config.plugin!.FacebookMessenger!.pageAccessToken;
    if (!fieldsValue || !pageAccessToken) {
      return;
    }
    const url = `https://graph.facebook.com/${this.getId()}?fields=${fieldsValue}&access_token=${pageAccessToken}`;
    const response = await HttpService.get<UserProfile>(url, { validateStatus: (_) => true });
    if (response.status === 200 && response.data) {
      return response.data;
    }

    Log.error(
      `Could not retrieve user profile. status: ${response.status}, data: ${
        response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
      }`,
    );
    return;
  }

  async fetchAndSetProfile(fields?: string) {
    this.profile = await this.fetchProfile(fields);
  }
}
