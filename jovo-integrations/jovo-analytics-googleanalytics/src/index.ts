export { GoogleAnalytics } from './GoogleAnalytics';
export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsGoogleAssistant } from './GoogleAnalyticsGoogleAssistant';

// Declare necessary properties for Jovo
import { Config, Event, Transaction, TransactionItem } from './interfaces';

interface AppGoogleAnalyticsConfig {
  GoogleAnalytics?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppGoogleAnalyticsConfig {}
  export interface ExtensiblePluginConfigs extends AppGoogleAnalyticsConfig {}
}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $googleAnalytics: {
      $data: { [key: string]: string | number };
      sendEvent: (params: Event) => void;
      sendTransaction: (params: Transaction) => void;
      sendItem: (params: TransactionItem) => void;
      sendUserEvent: Function;
      setCustomMetric: (index: number, value: string | number) => void;
    };

    getRoute(): { intent: string; path: string; type: string };

    getMappedIntentName(): string;
  }
}
