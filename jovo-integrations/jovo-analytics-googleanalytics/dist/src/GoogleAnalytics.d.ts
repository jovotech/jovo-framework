import * as ua from 'universal-analytics';
import { Analytics, BaseApp, HandleRequest } from 'jovo-core';
import { Jovo } from 'jovo-framework';
import { Config, validEndReasons, systemMetricNames, systemDimensionNames } from './interfaces';
export declare class GoogleAnalytics implements Analytics {
    /**
     * Need to save start state -\> will change during handling
     * Need to save lastUsed for calculation timeouts (sessionEnded bug display devices)
     *
     * @param handleRequest - jovo HandleRequest objekt
     */
    static saveStartStateAndLastUsed(handleRequest: HandleRequest): void;
    /**
     * Get end reason from session variables
     *
     * @param jovo - unser liebes Jovo objekt.
     * @returns - the endreason saved in the session data.
     */
    static getEndReason(jovo: Jovo): validEndReasons | undefined;
    config: Config;
    visitor: ua.Visitor | undefined;
    readonly systemMetricsIndices: Map<systemMetricNames, number>;
    readonly systemDimensionsIndices: Map<systemDimensionNames, number>;
    constructor(config?: Config);
    install(app: BaseApp): void;
    /**
     * Set custom metric for next pageview
     * Throws error if metricName is not mapped to an index in your config
     * @param name - metricName
     * @param targetValue - target value in googleAnalytics
     */
    protected setSystemMetric(name: systemMetricNames, targetValue: number): void;
    /**
    * Set custom dimension for next pageview
    * Throws error if dimensionName is not mapped to an index in your config
    * @param name - dimensionName
    * @param targetValue - target value in googleAnalytics
    */
    protected setSystemDimension(name: systemDimensionNames, targetValue: string | number): void;
    /**
     * Sets end reason to session variables + updates google analytics metric
     *
     * @param jovo - unser liebes Jovo objekt
     * @param endReason - grund für session ende
     */
    setEndReason(jovo: Jovo, endReason: validEndReasons): void;
    /**
     * Auto send intent data after each response. Also setting sessions and flowErrors
     * @param handleRequest
     */
    track(handleRequest: HandleRequest): void;
    /**
     * Initiates GoogleAnalytics visitor object with fixed parameters.
     * @param {object} jovo: Jovo object for data like language or platform
     */
    initVisitor(jovo: Jovo): void;
    /**
     * Tracks uncaught user exceptions.
     * @param {object} handleRequest: HandleRequest to act upon
     */
    sendError(handleRequest: HandleRequest): void;
    /**
     * Detects and sends flow errors, ranging from nlu errors to bugs in the skill handler.
     * @param {object} jovo: Jovo object
     */
    sendUnhandledEvents(jovo: Jovo): void;
    /**
     * Extract input from intent + send to googleAnalytics via events
     * @param jovo Jovo object
     */
    sendIntentInputEvents(jovo: Jovo): void;
    /**
     * Construct pageview parameters, a.k.a intent tracking data.
     * @param {object} jovo: Jovo object
     * @returns {object} pageParameters: Intent data to track
     */
    getPageParameters(jovo: Jovo): {
        documentPath: string;
        documentHostName: any;
        documentTitle: string;
    };
    /**
     * Change state to startState + root intent (not mappedIntent)
     *
     * @param jovo - unser liebes Jovo objekt
     * @override
     */
    getPageName(jovo: Jovo): string;
    /**
     * Generates hash for userId.
     * @param {object} jovo: Jovo object
     * @returns {string} uuid: Hashed user id
     */
    getUserId(jovo: Jovo): string;
    /**
     * Checks if the current session started or ended.
     * @param {object} jovo: Jovo object
     * @returns {string | void} sessionTag: Corresponding session tag (start|end|undefined)
     */
    getSessionTag(jovo: Jovo): string | void;
    /**
     * User Events ties users to event category and action
     * @param {object} jovo: Jovo object
     * @param {string} eventName maps to category -> eventGroup
     * @param {string} eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(jovo: Jovo, eventCategory: string, eventAction: string): void;
    /**
     * Sets the analytics variable to the instance of this object for making it accessable in skill code
     * @param handleRequest
     */
    setGoogleAnalyticsObject(handleRequest: HandleRequest): void;
}
