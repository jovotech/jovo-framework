import { HandleRequest, Jovo, BaseApp } from 'jovo-core';
import { GoogleAnalytics } from './GoogleAnalytics';
export declare class GoogleAnalyticsAlexa extends GoogleAnalytics {
    install(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
    initVisitor(jovo: Jovo): void;
    setGoogleAnalyticsObject(handleRequest: HandleRequest): void;
    setErrorEndReason(handleRequest: HandleRequest): void;
    sendUnhandledEvents(jovo: Jovo): void;
}
