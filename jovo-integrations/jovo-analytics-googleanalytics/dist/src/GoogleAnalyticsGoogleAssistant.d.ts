import { GoogleAnalytics } from './GoogleAnalytics';
import { HandleRequest, Jovo } from 'jovo-core';
export declare class GoogleAnalyticsGoogleAssistant extends GoogleAnalytics {
    track(handleRequest: HandleRequest): void;
    initVisitor(jovo: Jovo): void;
    setGoogleAnalyticsObject(handleRequest: HandleRequest): void;
}
