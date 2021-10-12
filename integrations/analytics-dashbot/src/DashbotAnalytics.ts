import {
  AnalyticsPlugin,
  AnalyticsPluginConfig,
  axios,
  AxiosResponse,
  Jovo,
  JovoError,
  UnknownObject,
} from '@jovotech/framework';
import { URL } from 'url';
import { DashbotAnalyticsPlugin } from './interfaces';
import { DashbotAlexa } from './plugins/DashbotAlexa';
import { DashbotUniversal } from './plugins/DashbotUniversal';
import { DASHBOT_BASE_URL } from './utilities';

export type PlatformKey = typeof DashbotAnalytics.prototype.plugins[number]['id'];

export interface DashbotConfig extends AnalyticsPluginConfig {
  apiKey: string;
  platforms: Record<typeof DashbotAnalytics.prototype.plugins[number]['id'], { apiKey: string }>;
}

export class DashbotAnalytics extends AnalyticsPlugin<DashbotConfig> {
  // Since DashbotUniversal tracks for every platform, it needs to sit at the last position
  // in this.plugins, so a platform-specific plugin can be found, but still disabled.
  plugins = [new DashbotAlexa(), new DashbotUniversal()] as const;

  getDefaultConfig(): DashbotConfig {
    return { apiKey: '<YOUR-API-KEY-HERE', platforms: { alexa: { apiKey: '' } } };
  }

  async trackRequest(jovo: Jovo): Promise<void> {
    const plugin: DashbotAnalyticsPlugin | undefined = this.plugins.find((plugin) =>
      plugin.canHandle(jovo.$platform),
    );

    // TODO: If platforms is ujndefined, track all platforms?
    if (!plugin || !this.config.platforms[plugin.id]) {
      return;
    }

    const url: URL = new URL(DASHBOT_BASE_URL);
    url.searchParams.append('type', 'incoming');
    url.searchParams.append('platform', plugin.id);
    url.searchParams.append('apiKey', this.getApiKey(plugin.id));

    await this.sendDashbotRequest(url.href, plugin.createRequestLog(jovo));
  }

  async trackResponse(jovo: Jovo): Promise<void> {
    const plugin: DashbotAnalyticsPlugin | undefined = this.plugins.find((plugin) =>
      plugin.canHandle(jovo.$platform),
    );

    // TODO: If platforms is ujndefined, track all platforms?
    if (!plugin || !this.config.platforms[plugin.id]) {
      return;
    }

    const url: URL = new URL(DASHBOT_BASE_URL);
    url.searchParams.append('type', 'outgoing');
    url.searchParams.append('platform', plugin.id);
    url.searchParams.append('apiKey', this.getApiKey(plugin.id));

    await this.sendDashbotRequest(url.href, plugin.createResponseLog(jovo));
  }

  private async sendDashbotRequest(url: string, data: UnknownObject): Promise<void> {
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

  private getApiKey(pluginId: PlatformKey) {
    return this.config.platforms[pluginId].apiKey;
  }
}
