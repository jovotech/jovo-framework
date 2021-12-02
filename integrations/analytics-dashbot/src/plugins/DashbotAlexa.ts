import { Jovo, JovoRequest, JovoResponse, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

export interface DashbotAlexaRequestLog extends UnknownObject {
  event: JovoRequest;
}

export interface DashbotAlexaResponseLog extends DashbotAlexaRequestLog {
  response: JovoResponse;
}

export class DashbotAlexa extends DashbotAnalyticsPlugin {
  readonly id: string = 'alexa';

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const requestLog: DashbotAlexaRequestLog = { event: jovo.$request };

    await this.sendDashbotRequest(url, requestLog);
  }

  async trackResponse(jovo: Jovo, url: string): Promise<void> {
    const responseLog: DashbotAlexaResponseLog = {
      event: jovo.$request,
      response: jovo.$response as JovoResponse,
    };

    await this.sendDashbotRequest(url, responseLog);
  }

  canHandle(platform: Platform): boolean {
    return platform.name === 'AlexaPlatform';
  }
}
