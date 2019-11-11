import { IEvent, ITransaction, ITransactionItem } from './src/interfaces';
import { SpeechBuilder } from 'jovo-core';

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
        getRoute(): any;
        getMappedIntentName(): string;
    }
}