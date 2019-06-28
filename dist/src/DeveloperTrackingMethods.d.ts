import { GoogleAnalyticsSender } from "./GoogleAnalyticsSender";
import { Jovo } from 'jovo-core';
import * as ua from 'universal-analytics';
import { EventParameters, ItemParams, TransactionParams } from './GoogleAnalyticsSender';
export declare class DeveloperTrackingMethods {
    globalGARef: GoogleAnalyticsSender;
    jovo: Jovo;
    constructor(googleAnalytics: GoogleAnalyticsSender, jovo: Jovo);
    sendEvent(eventParameters: EventParameters): void;
    sendTransaction(transactionParams: TransactionParams): void;
    sendItem(itemParams: ItemParams): void;
    sendUserTransaction(transactionId: string): void;
    sendCustomMetric(indexInGA: number, value: string): void;
    /**
    * User Events ties users to event category and action
    * @param eventName maps to category -> eventGroup
    * @param eventElement maps to action -> instance of eventGroup
    */
    sendUserEvent(eventCategory: string, eventElement?: string): void;
    /**
     * Generates Hash for User Id
     */
    getUserId(): string;
    /**
     * Generates pageName from State and Intent Name
     * @param jovo
     */
    getPageName(): string;
    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(): ua.Visitor | undefined;
}
