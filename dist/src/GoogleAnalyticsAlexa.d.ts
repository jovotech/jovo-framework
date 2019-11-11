import { HandleRequest, Jovo } from "jovo-core";
import { GoogleAnalytics } from "./GoogleAnalytics";
export declare class GoogleAnalyticsAlexa extends GoogleAnalytics {
    track(handleRequest: HandleRequest): void;
    initVisitor(jovo: Jovo): void;
    setGoogleAnalyticsObject(handleRequest: HandleRequest): void;
    sendUnhandledEvents(jovo: Jovo): void;
}
