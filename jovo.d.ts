import { IEvent, ITransaction, ITransactionItem } from './src/interfaces';

declare module 'jovo-core' {
    export interface Jovo {
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