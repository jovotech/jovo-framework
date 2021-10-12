import { Jovo, Platform, UnknownObject } from '@jovotech/framework';

export interface DashbotAnalyticsPlugin {
  id: string;
  createRequestLog(jovo: Jovo): UnknownObject;
  createResponseLog(jovo: Jovo): UnknownObject;
  canHandle(platform: Platform): boolean;
}
