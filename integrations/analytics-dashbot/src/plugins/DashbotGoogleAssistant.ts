import { Jovo, JovoRequest, JovoResponse, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

export interface DashbotGoogleAssistantRequestLog extends UnknownObject {
  request_body: {
    fulfillmentLib: '@assistant/conversation';
    request: JovoRequest;
  };
}

export interface DashbotGoogleAssistantResponseLog extends DashbotGoogleAssistantRequestLog {
  message?: { response: { body: JovoResponse }; fulfillmentLib: '@assistant/conversation' };
}

export class DashbotGoogleAssistant extends DashbotAnalyticsPlugin {
  get id(): string {
    return 'google';
  }

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const requestLog: DashbotGoogleAssistantRequestLog = {
      request_body: {
        fulfillmentLib: '@assistant/conversation',
        request: jovo.$request,
      },
    };

    await this.sendDashbotRequest(url, requestLog);
  }

  async trackResponse(jovo: Jovo, url: string): Promise<void> {
    const responseLog: DashbotGoogleAssistantResponseLog = {
      request_body: {
        fulfillmentLib: '@assistant/conversation',
        request: jovo.$request,
      },
      message: {
        fulfillmentLib: '@assistant/conversation',
        // jovo.$response is of type array here, but for GoogleAssistant,
        // only single responses can be sent, hence a conversion is justified
        response: { body: jovo.$response as JovoResponse },
      },
    };

    await this.sendDashbotRequest(url, responseLog);
  }

  canHandle(platform: Platform): boolean {
    return platform.constructor.name === 'GoogleAssistantPlatform';
  }
}
