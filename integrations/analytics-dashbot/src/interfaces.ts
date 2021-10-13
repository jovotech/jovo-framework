import { UnknownObject } from '@jovotech/framework';

export interface DashbotAnalyticsConfig extends UnknownObject {
  platforms: DashbotAnalyticsConfigPlugins;
}

export interface DashbotAnalyticsConfigPlugins {}

export interface DashbotAnalyticsPluginConfig {
  apiKey: string;
  enabled?: boolean;
}
