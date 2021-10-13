import { Jovo, JovoResponse, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

declare module '../interfaces' {
  interface DashbotAnalyticsConfigPlugins {
    facebook?: DashbotAnalyticsPluginConfig;
  }
}

export class DashbotFacebook extends DashbotAnalyticsPlugin {
  get id(): string {
    return 'facebook';
  }

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const requestLog: UnknownObject = {
      object: 'page',
      entry: [jovo.$request],
    };

    await this.sendDashbotRequest(url, requestLog);
  }

  async trackResponse(jovo: Jovo, url: string): Promise<void> {
    for (const response of jovo.$response as JovoResponse[]) {
      const responseLog: UnknownObject = {
        qs: {
          access_token: jovo.$plugins.FacebookMessengerPlatform?.config.pageAccessToken,
        },
        uri: 'https://graph.facebook.com/v10.0/me/messages',
        json: response,
        method: 'POST',
        responseBody: {
          message_id: '',
          recipient_id: '',
        },
      };

      await this.sendDashbotRequest(url, responseLog);
    }
  }

  canHandle(platform: Platform): boolean {
    return platform.constructor.name === 'FacebookMessenger';
  }
}
