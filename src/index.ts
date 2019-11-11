export { GoogleAnalytics } from './GoogleAnalytics';
export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsAssistant } from './GoogleAnalyticsAssistant';

// Declare necessary properties for Jovo
import { IEvent, ITransaction, ITransactionItem } from './interfaces';
declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $googleAnalytics: {
            $data: { [key: string]: string | number };
            sendEvent: (params: IEvent) => void;
            sendTransaction: (params: ITransaction) => void;
            sendItem: (params: ITransactionItem) => void;
            sendUserEvent: Function;
            setCustomMetric: (index: number, value: string | number) => void;
        };
        getRoute(): { intent: string, path: string, type: string };
        getMappedIntentName(): string;
    }
}