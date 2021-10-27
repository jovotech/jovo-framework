import { AnalyticsPlugin, AnalyticsPluginConfig, Jovo, Platform } from '@jovotech/framework';
import { URL } from 'url';
import { DashbotAlexa } from './plugins/DashbotAlexa';
import { DashbotAnalyticsPlugin } from './plugins/DashbotAnalyticsPlugin';
import { DashbotFacebook } from './plugins/DashbotFacebook';
import { DashbotGoogleAssistant } from './plugins/DashbotGoogleAssistant';
import { DashbotUniversal } from './plugins/DashbotUniversal';
import { DASHBOT_BASE_URL } from './utilities';

export interface DashbotAnalyticsConfig extends AnalyticsPluginConfig {
  apiKey: string;
  enabled?: boolean;
}

export class DashbotAnalytics extends AnalyticsPlugin<DashbotAnalyticsConfig> {
  // Since DashbotUniversal tracks for every platform, it needs to sit at the last position
  // in this.plugins, so a platform-specific plugin can be found, but still disabled.
  private readonly plugins = [
    DashbotAlexa,
    DashbotGoogleAssistant,
    DashbotFacebook,
    DashbotUniversal,
  ];
  private initializedPlugin!: DashbotAnalyticsPlugin;

  mount(parent: Platform): void {
    const HandlingPlugin = this.plugins.find((Plugin) => Plugin.prototype.canHandle(parent));

    if (!HandlingPlugin || this.config.enabled === false) {
      return;
    }

    this.initializedPlugin = new HandlingPlugin();
    super.mount(parent);
  }

  getDefaultConfig(): DashbotAnalyticsConfig {
    return {
      apiKey: '<YOUR-API-KEY>',
    };
  }

  async trackRequest(jovo: Jovo): Promise<void> {
    const url: URL = new URL(DASHBOT_BASE_URL);
    url.searchParams.append('type', 'incoming');
    url.searchParams.append('platform', this.initializedPlugin.id);
    url.searchParams.append('apiKey', this.config.apiKey);

    await this.initializedPlugin.trackRequest(jovo, url.href);
  }

  async trackResponse(jovo: Jovo): Promise<void> {
    const url: URL = new URL(DASHBOT_BASE_URL);
    url.searchParams.append('type', 'outgoing');
    url.searchParams.append('platform', this.initializedPlugin.id);
    url.searchParams.append('apiKey', this.config.apiKey);

    await this.initializedPlugin.trackResponse(jovo, url.href);
  }
}
