export { GoogleAnalytics } from './GoogleAnalytics';
export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsGoogleAssistant } from './GoogleAnalyticsGoogleAssistant';
import { Config, Event, Transaction, TransactionItem } from './interfaces';
interface AppGoogleAnalyticsConfig {
    GoogleAnalytics?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppAnalyticsConfig extends AppGoogleAnalyticsConfig {
    }
    interface ExtensiblePluginConfigs extends AppGoogleAnalyticsConfig {
    }
}
declare module 'jovo-core/dist/src/core/Jovo' {
    interface Jovo {
        $googleAnalytics: {
            $data: {
                [key: string]: string | number;
            };
            $parameters: {
                [key: string]: string | number;
            };
            sendEvent: (params: Event) => void;
            sendTransaction: (params: Transaction) => void;
            sendItem: (params: TransactionItem) => void;
            sendUserEvent: Function;
            setCustomMetric: (index: number, value: string | number) => void;
            setCustomDimension: (index: number, value: string | number) => void;
            /**
             * Set a custom Google Analytics parameter
             *
             * @ref https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
             */
            setParameter: (parameter: string, value: string | number) => void;
            /**
             * Set Google Optimize experiment parameters
             *
             * @ref https://developers.google.com/optimize/devguides/experiments
             */
            setOptimizeExperiment: (experimentId: string, variation: string | number) => void;
        };
        getRoute(): {
            intent: string;
            path: string;
            type: string;
        };
        getMappedIntentName(): string;
    }
}
