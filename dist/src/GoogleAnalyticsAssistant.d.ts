import { GoogleAnalytics } from "./GoogleAnalytics";
import { HandleRequest, Jovo } from "jovo-core";
export declare class GoogleAnalyticsAssistant extends GoogleAnalytics {
    track(handleRequest: HandleRequest): void;
    initVisitor(jovo: Jovo): void;
    setGoogleAnalyticsObject(handleRequest: HandleRequest): void;
}
