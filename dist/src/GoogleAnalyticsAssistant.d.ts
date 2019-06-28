import { GoogleAnalyticsSender } from "./GoogleAnalyticsSender";
import * as ua from 'universal-analytics';
import { HandleRequest, Jovo } from "jovo-core";
export declare class GoogleAnalyticsAssistant extends GoogleAnalyticsSender {
    setJovoObjectAccess(handleRequest: HandleRequest): void;
    sendDataToGA(handleRequest: HandleRequest): void;
    initVisitor(jovo: Jovo): ua.Visitor;
}
