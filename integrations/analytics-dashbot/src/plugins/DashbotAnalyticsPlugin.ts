import { axios, Jovo, JovoError, Platform, UnknownObject } from '@jovotech/framework';

export abstract class DashbotAnalyticsPlugin {
  abstract readonly id: string;

  protected async sendDashbotRequest(url: string, data: UnknownObject): Promise<void> {
    try {
      await axios.post(url, data);
    } catch (error) {
      if (error.isAxiosError) {
        let message: string;
        if (Array.isArray(error.response.data.errors)) {
          message = error.response.data.errors.join('\n');
        } else if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else {
          message = JSON.stringify(error.response.data);
        }

        throw new JovoError({
          message: `Request to Dashbot failed: ${message}`,
        });
      }

      throw new JovoError({ message: error.message });
    }
  }

  abstract trackRequest(jovo: Jovo, url: string): Promise<void>;

  abstract trackResponse(jovo: Jovo, url: string): Promise<void>;

  abstract canHandle(platform: Platform): boolean;
}
