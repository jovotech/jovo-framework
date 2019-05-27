import { Plugin, PluginConfig, BaseApp, HandleRequest, Jovo } from 'jovo-core';
import * as ua from 'universal-analytics';
export interface Config extends PluginConfig {
    accountId: string;
}
export interface EventParameters {
    ec: string;
    ea: string;
    el?: string;
    ev?: number;
    dp?: string;
}
export declare class GoogleAnalyticsSender implements Plugin {
    name?: string | undefined;
    config: Config;
    constructor(config?: Config);
    static getAlexaDevice(alexaRequest: any): string;
    static getScreenResolution(alexaRequest: any): string;
    install(app: BaseApp): void;
    uninstall(parent?: any): void;
    /**
     * Pageviews should allways send intent data -> method returns standard
     * @param jovo
     */
    getCurrentPageParameters(jovo: Jovo): ua.PageviewParams;
    /**
     * SendEvent with parameters are custom
     * @param visitor
     * @param jovo
     * @param eventParameters
     */
    sendIntentEvent(visitor: ua.Visitor, jovo: Jovo, eventParameters: EventParameters): void;
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
    /**
     * User Events ties users to event category and action
     * @param jovo
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo: Jovo, eventName: string, eventElement?: string): void;
    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors
     * @param handleRequest
     */
    sendDataToAnalytics(handleRequest: HandleRequest): void;
    /**
     * Auto send Exception to Google Analytics if Error
     * @param handleRequest
     */
    sendErrorToGoogle(handleRequest: HandleRequest): void;
}
