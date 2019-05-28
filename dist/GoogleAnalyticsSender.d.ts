import { PluginConfig, BaseApp, HandleRequest, Jovo, Analytics } from 'jovo-core';
import * as ua from 'universal-analytics';
export interface Config extends PluginConfig {
    trackingId: string;
}
export interface EventParameters {
    ec: string;
    ea: string;
    el?: string;
    ev?: number;
    dp?: string;
}
/**
 * @public
 */
export declare class GoogleAnalyticsSender implements Analytics {
    name?: string | undefined;
    jovo?: Jovo | undefined;
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
    getCurrentPageParameters(): ua.PageviewParams | undefined;
    /**
     * SendEvent with parameters are custom
     * @param visitor
     * @param jovo
     * @param eventParameters
     */
    sendIntentEvent(visitor: ua.Visitor, eventParameters: EventParameters): void;
    throwJovoNotSetError(): void;
    /**
     * Generates Hash for User Id
     * @param jovo
     */
    getUserId(): string;
    /**
     * Generates pageName from State and Intent Name
     * @param jovo
     */
    getPageName(): string;
    static getScreenResolution(alexaRequest: any): string;
    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(): ua.Visitor | undefined;
    /**
     * User Events ties users to event category and action
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(eventCategory: string, eventElement?: string): void;
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
