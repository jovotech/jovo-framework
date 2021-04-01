export { GoogleAnalytics } from './GoogleAnalytics';
export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsGoogleAssistant } from './GoogleAnalyticsGoogleAssistant';
export { GoogleAnalyticsInstance } from './GoogleAnalyticsInstance';
export { SystemMetricNamesEnum } from './interfaces';
import { GoogleAnalyticsGoogleAssistant } from './GoogleAnalyticsGoogleAssistant';

import { Visitor } from 'universal-analytics';
import { GoogleAnalytics } from './GoogleAnalytics';

// Declare necessary properties for Jovo
import {
  Config,
  Event,
  systemDimensionNames,
  systemMetricNames,
  Transaction,
  TransactionItem,
} from './interfaces';
import { GoogleAnalyticsInstance } from './GoogleAnalyticsInstance';

interface AppGoogleAnalyticsConfig {
  GoogleAnalytics?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppGoogleAnalyticsConfig {}
  export interface ExtensiblePluginConfigs extends AppGoogleAnalyticsConfig {}
}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $googleAnalytics: GoogleAnalyticsInstance;
  }
}
