import { JovoBigQuery } from './JovoBigQuery';
import { BigQueryAnalytics, BigQueryAnalyticsPluginConfig } from './BigQueryAnalytics';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    BigQueryAnalytics?: BigQueryAnalyticsPluginConfig;
  }

  interface ExtensiblePlugins {
    BigQueryAnalytics?: BigQueryAnalytics;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $bigQuery: JovoBigQuery;
  }
}

export * from './BigQueryAnalytics';
