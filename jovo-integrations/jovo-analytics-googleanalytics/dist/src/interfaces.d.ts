import { PluginConfig } from 'jovo-core';
export declare type validEndReasons = 'Stop' | 'ERROR' | 'EXCEEDED_MAX_REPROMPTS' | 'PLAYTIME_LIMIT_REACHED' | 'PlayTimeLimitReached' | 'USER_INITIATED' | 'undefined';
export declare type systemMetricNames = validEndReasons;
export declare type systemDimensionNames = 'uuid';
export interface Event {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
    eventValue?: number;
    documentPath?: string;
}
/**
 * Represents a transaction, consisting of one or more transaction items, e.g. ISP.
 */
export interface Transaction {
    transactionId: string;
    transactionRevenue?: string | number;
    transactionShipping?: string | number;
    transactionTax?: string | number;
    transactionAffiliation?: string;
    [key: string]: any;
}
export interface TransactionItem {
    transactionId: string;
    itemName: string;
    itemPrice?: string | number;
    itemQuantity?: string | number;
    itemCode?: string;
    itemCategory?: string;
    [key: string]: any;
}
export interface Config extends PluginConfig {
    trackingId: string;
    trackDirectives?: boolean;
    enableAutomaticEvents?: boolean;
    trackEndReasons?: boolean;
    sessionTimeoutInMinutes: number;
    skipUnverifiedUser: boolean;
    systemMetrics: [systemMetricNames, number][];
    systemDimensions: [systemDimensionNames, number][];
}
