import { AnalyticsPlugin, axios, Jovo, JovoError, UnknownObject } from '@jovotech/framework';
import { URL } from 'url';
import { DashbotAlexa } from './plugins/DashbotAlexa';
import { DashbotAnalyticsPlugin } from './plugins/DashbotAnalyticsPlugin';
import { DashbotGoogleAssistant } from './plugins/DashbotGoogleAssistant';
import { DashbotUniversal } from './plugins/DashbotUniversal';
import { DASHBOT_BASE_URL } from './utilities';
import { DashbotAnalyticsConfig } from './interfaces';
import { DashbotFacebook } from './plugins/DashbotFacebook';

export class DashbotAnalytics extends AnalyticsPlugin<DashbotAnalyticsConfig> {
  // Since DashbotUniversal tracks for every platform, it needs to sit at the last position
  // in this.plugins, so a platform-specific plugin can be found, but still disabled.
  private readonly plugins = [
    DashbotAlexa,
    DashbotGoogleAssistant,
    DashbotFacebook,
    DashbotUniversal,
  ];
  private readonly initializedPlugins: DashbotAnalyticsPlugin[];

  constructor(config: DashbotAnalyticsConfig) {
    super(config);
    this.initializedPlugins = this.plugins
      .filter((Plugin) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.config.platforms[Plugin.prototype.id]?.enabled !== false;
      })
      .map((Plugin) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new Plugin(this.config.platforms[Plugin.prototype.id]);
      });
  }

  getDefaultConfig(): DashbotAnalyticsConfig {
    return {
      platforms: {
        alexa: { apiKey: '', enabled: true },
        google: { apiKey: '', enabled: true },
        facebook: { apiKey: '', enabled: true },
        universal: { apiKey: '', enabled: true },
      },
    };
  }

  async trackRequest(jovo: Jovo): Promise<void> {
    const plugin: DashbotAnalyticsPlugin | undefined = this.initializedPlugins.find((plugin) =>
      plugin.canHandle(jovo.$platform),
    );

    if (!plugin) {
      return;
    }

    const url: URL = new URL(DASHBOT_BASE_URL);
    url.searchParams.append('type', 'incoming');
    url.searchParams.append('platform', plugin.id);
    url.searchParams.append('apiKey', this.getApiKey(plugin.id));

    await plugin.trackRequest(jovo, url.href);
  }

  async trackResponse(jovo: Jovo): Promise<void> {
    const plugin: DashbotAnalyticsPlugin | undefined = this.initializedPlugins.find((plugin) =>
      plugin.canHandle(jovo.$platform),
    );

    if (!plugin) {
      return;
    }

    const url: URL = new URL(DASHBOT_BASE_URL);
    url.searchParams.append('type', 'outgoing');
    url.searchParams.append('platform', plugin.id);
    url.searchParams.append('apiKey', this.getApiKey(plugin.id));

    await plugin.trackResponse(jovo, url.href);
  }

  private getApiKey(pluginId: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.config.platforms[pluginId].apiKey;
  }
}
