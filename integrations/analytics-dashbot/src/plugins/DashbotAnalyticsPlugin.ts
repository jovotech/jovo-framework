import { axios, Jovo, JovoError, Platform, UnknownObject } from '@jovotech/framework';
import { DashbotAnalyticsPluginConfig } from '../interfaces';

export abstract class DashbotAnalyticsPlugin<
  CONFIG extends DashbotAnalyticsPluginConfig = DashbotAnalyticsPluginConfig,
> {
  readonly config: CONFIG;

  // This must be a getter to be accessible within the scope of the prototype
  abstract get id(): string;

  constructor(config: CONFIG) {
    this.config = config;
  }

  protected async sendDashbotRequest(url: string, data: UnknownObject): Promise<void> {
    try {
      await axios.post(url, data);
    } catch (error) {
      if (error.isAxiosError) {
        throw new JovoError({
          message: error.message,
          details: error.response.data.errors.join('\n'),
        });
      }

      throw new JovoError({ message: error.message });
    }
  }

  abstract trackRequest(jovo: Jovo, url: string): Promise<void>;

  abstract trackResponse(jovo: Jovo, url: string): Promise<void>;

  abstract canHandle(platform: Platform): boolean;
}
