import { PluginConfig, BaseApp, HandleRequest, Jovo, Analytics } from 'jovo-core';
import * as ua from 'universal-analytics';
export interface Config extends PluginConfig {
    trackingId: string;
}
export interface EventParameters {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
    eventValue?: number;
    documentPath?: string;
}
export interface TransactionParams {
    ti: string;
    tr?: string | number;
    ts?: string | number;
    tt?: string | number;
    ta?: string;
    p?: string;
    [key: string]: any;
}
export interface ItemParams {
    ip?: string | number;
    iq?: string | number;
    ic?: string;
    in?: string;
    iv?: string;
    p?: string;
    ti: string;
    [key: string]: any;
}
/**
 * @public
 */
export declare class GoogleAnalyticsSender implements Analytics {
    name?: string | undefined;
    config: Config;
    constructor(config?: Config);
    track(handleRequest: HandleRequest): void;
    install(app: BaseApp): void;
    uninstall(parent?: any): void;
    /**
     * Sets the analytics variable to the instance of this object for making it accessable in skill code
     * @param handleRequest
     */
    setJovoObjectAccess(handleRequest: HandleRequest): void;
    /**
     * Pageviews should allways send intent data -> method returns standard
     */
    getCurrentPageParameters(jovo: Jovo): ua.PageviewParams;
    /**
     * SendEvent with parameters are custom
     * @param visitor
     * @param eventParameters
     */
    sendIntentEvent(visitor: ua.Visitor, eventParameters: EventParameters): void;
    sendEvent(jovo: Jovo, eventParameters: EventParameters): void;
    sendTransaction(jovo: Jovo, transactionParams: TransactionParams): void;
    sendItem(jovo: Jovo, itemParams: ItemParams): void;
    /**
     * throws an error if jovo was not set
     */
    throwJovoNotSetError(): void;
    /**
     * Generates Hash for User Id
     * @param jovo
     */
    getUserId(jovo: Jovo): string;
    /**
     * Generates pageName from State and Intent Name
     * @param jovo
     */
    getPageName(jovo: Jovo): string;
    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(jovo: Jovo): ua.Visitor;
    sendCustomMetric(jovo: Jovo, indexInGA: number, value: string): void;
    sendUserTransaction(jovo: Jovo, transactionId: string): void;
    /**
     * User Events ties users to event category and action
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo: Jovo, eventCategory: string, eventElement?: string): void;
    sendFlowErrors(jovo: Jovo): void;
    /**
     * Checks if session started or ended
     * returns end, start, undefined
     */
    getSessionTag(jovo: Jovo): string | undefined;
    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors
     * @param handleRequest
     */
    sendDataToGA(handleRequest: HandleRequest): void;
    /**
     * Auto send Exception to Google Analytics if Error
     * @param handleRequest
     */
    sendErrorToGA(handleRequest: HandleRequest): void;
}
