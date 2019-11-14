export { GoogleAnalytics } from './GoogleAnalytics';
export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsAssistant } from './GoogleAnalyticsAssistant';

// Declare necessary properties for Jovo
// import { AlexaSkill } from 'jovo-platform-alexa';
import { Event, Transaction, TransactionItem } from './interfaces';
declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $googleAnalytics: {
            $data: { [key: string]: string | number };
            sendEvent: (params: Event) => void;
            sendTransaction: (params: Transaction) => void;
            sendItem: (params: TransactionItem) => void;
            sendUserEvent: Function;
            setCustomMetric: (index: number, value: string | number) => void;
        };
        // $alexaSkill?: AlexaSkill | undefined;
        getRoute(): { intent: string, path: string, type: string };
        getMappedIntentName(): string;
    }
}