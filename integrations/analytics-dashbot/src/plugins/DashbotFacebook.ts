import { Jovo, JovoRequest, JovoResponse, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

declare module '../interfaces' {
  interface DashbotAnalyticsConfigPlugins {
    facebook?: DashbotAnalyticsPluginConfig;
  }
}

export interface DashbotFacebookRequestLog extends UnknownObject {
  object: 'page';
  entry: [JovoRequest];
}

export interface DashbotFacebookResponseLog extends UnknownObject {
  qs: {
    access_token: string;
  };
  uri: string;
  json: JovoResponse;
  method: 'POST';
}

export class DashbotFacebook extends DashbotAnalyticsPlugin {
  get id(): string {
    return 'facebook';
  }

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const requestLog: DashbotFacebookRequestLog = {
      object: 'page',
      entry: [jovo.$request],
    };

    await this.sendDashbotRequest(url, requestLog);
  }

  async trackResponse(jovo: Jovo, url: string): Promise<void> {
    for (const response of (jovo.$response || []) as JovoResponse[]) {
      const responseLog: UnknownObject = {
        qs: {
          access_token: jovo.$plugins.FacebookMessengerPlatform?.config.pageAccessToken,
        },
        uri: 'https://graph.facebook.com/v10.0/me/messages',
        json: response,
        method: 'POST',
      };

      await this.sendDashbotRequest(url, responseLog);
    }
  }

  canHandle(platform: Platform): boolean {
    return platform.constructor.name === 'FacebookMessenger';
  }
}
