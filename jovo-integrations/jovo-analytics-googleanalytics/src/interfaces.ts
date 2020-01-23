import { PluginConfig } from 'jovo-core';

export interface Event {
  eventCategory: string; // Category for event, e.g. Inputs, Errors, ...
  eventAction: string; // Value for the event to track
  eventLabel?: string; // Label under which to track the event, e.g. userId, ...
  eventValue?: number; // Event value/weight
  documentPath?: string; // Path portion of the current conversational flow
}

/**
 * Represents a transaction, consisting of one or more transaction items, e.g. ISP.
 */
export interface Transaction {
  transactionId: string; // Unique id for transaction and corresponding items
  transactionRevenue?: string | number; // Total revenue
  transactionShipping?: string | number; // Shipping cost
  transactionTax?: string | number; // Total tax cost
  transactionAffiliation?: string; // Affiliation, e.g. skill name
  [key: string]: any; // Custom parameters
}

export interface TransactionItem {
  transactionId: string; // Transaction id
  itemName: string; // TransactionItem name
  itemPrice?: string | number; // Price for a single item
  itemQuantity?: string | number; // Number of items purchased
  itemCode?: string; // TransactionItem code/SKU
  itemCategory?: string; // Category the item belongs to
  [key: string]: any; // Custom parameters
}

export interface Config extends PluginConfig {
  trackingId: string;
  trackDirectives?: boolean;
}
