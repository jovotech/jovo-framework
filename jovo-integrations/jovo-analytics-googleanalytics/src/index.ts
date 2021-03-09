export { GoogleAnalytics } from './GoogleAnalytics';
export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsGoogleAssistant } from './GoogleAnalyticsGoogleAssistant';
export {SystemMetricNamesEnum} from './interfaces';

import {GoogleAnalytics} from './GoogleAnalytics';

// Declare necessary properties for Jovo
import { Config, Event, systemDimensionNames, systemMetricNames, Transaction, TransactionItem } from './interfaces';

interface AppGoogleAnalyticsConfig {
  GoogleAnalytics?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppGoogleAnalyticsConfig {}
  export interface ExtensiblePluginConfigs extends AppGoogleAnalyticsConfig {}
}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $googleAnalytics: GoogleAnalytics;
    getRoute(): { intent: string; path: string; type: string };

    getMappedIntentName(): string;
  }
}
