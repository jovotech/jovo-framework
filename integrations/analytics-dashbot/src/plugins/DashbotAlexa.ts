import { Jovo, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

declare module '../interfaces' {
  export interface DashbotAnalyticsConfigPlugins {
    alexa?: DashbotAnalyticsPluginConfig;
  }
}

export class DashbotAlexa extends DashbotAnalyticsPlugin {
  get id(): string {
    return 'alexa';
  }

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const requestLog: UnknownObject = { event: jovo.$request };

    await this.sendDashbotRequest(url, requestLog);
  }

  async trackResponse(jovo: Jovo, url: string): Promise<void> {
    const responseLog: UnknownObject = {
      event: jovo.$request,
      response: jovo.$response,
    };

    await this.sendDashbotRequest(url, responseLog);
  }

  canHandle(platform: Platform): boolean {
    return platform.constructor.name === 'AlexaPlatform';
  }
}
