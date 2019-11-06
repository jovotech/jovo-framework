import { PluginConfig } from "jovo-core";

export interface Event {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
    eventValue?: number;
    documentPath?: string;
}

export interface Transaction {
    ti: string;
    tr?: string | number;
    ts?: string | number;
    tt?: string | number;
    ta?: string;
    p?: string;
    [key: string]: any;
}

export interface Item {
    ip?: string | number;
    iq?: string | number;
    ic?: string;
    in?: string;
    iv?: string;
    p?: string;
    ti: string;
    // TODO: necessary?
    [key: string]: any;
}

export interface Config extends PluginConfig {
    trackingId: string;
}

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        $googleAnalytics: {
            $data: any;
            sendEvent: Function;
            sendTransaction: Function;
            sendItem: Function;
            sendUserEvent: Function;
            sendUserTransaction: Function;
            setCustomMetric: Function;
        };
        getMappedIntentName: Function;
        getRoute: Function;
    }
}