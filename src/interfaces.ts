import { PluginConfig } from "jovo-core";

export interface IEvent {
    eventCategory: string;  // Category for event, e.g. Inputs, Errors, ...
    eventAction: string;    // Value for the event to track
    eventLabel?: string;    // Label under which to track the event, e.g. userId, ... 
    eventValue?: number;    // IEvent value/weight
    documentPath?: string;  // Path portion of the current conversational flow
}

/**
 * Represents a transaction, consisting of one or more transaction items, e.g. ISP.
 */
export interface ITransaction {
    transactionId: string;                  // Unique id for transaction and corresponding items
    transactionRevenue?: string | number;   // Total revenue     
    transactionShipping?: string | number;  // Shipping cost
    transactionTax?: string | number;       // Total tax cost
    transactionAffiliation?: string;        // Affiliation, e.g. skill name
    [key: string]: any;                     // Custom parameters
}

export interface ITransactionItem {
    transactionId: string;          // ITransaction id
    itemName: string;               // ITransactionItem name
    itemPrice?: string | number;    // Price for a single item
    itemQuantity?: string | number; // Number of items purchased
    itemCode?: string;              // ITransactionItem code/SKU
    itemCategory?: string;          // Category the item belongs to
    [key: string]: any;             // Custom parameters
}

export interface IConfig extends PluginConfig {
    trackingId: string;
}