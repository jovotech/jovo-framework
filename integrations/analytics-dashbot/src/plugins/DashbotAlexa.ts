import { Jovo, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from '../interfaces';

export class DashbotAlexa implements DashbotAnalyticsPlugin {
  readonly id = 'alexa' as const;

  createRequestLog(jovo: Jovo): UnknownObject {
    return { event: jovo.$server.getRequestObject() };
  }

  createResponseLog(jovo: Jovo): UnknownObject {
    return { event: jovo.$server.getRequestObject(), response: jovo.$response };
  }

  canHandle(platform: Platform): boolean {
    return platform.constructor.name === 'AlexaPlatform';
  }
}
