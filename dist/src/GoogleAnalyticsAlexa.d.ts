import { GoogleAnalyticsSender } from "./GoogleAnalyticsSender";
import * as ua from 'universal-analytics';
import { HandleRequest, Jovo } from "jovo-core";
export declare class GoogleAnalyticsAlexa extends GoogleAnalyticsSender {
    setJovoObjectAccess(handleRequest: HandleRequest): void;
    sendDataToGA(handleRequest: HandleRequest): void;
    sendFlowErrors(jovo: Jovo): void;
    initVisitor(jovo: Jovo): ua.Visitor;
    getCurrentPageParameters(jovo: Jovo): ua.PageviewParams;
}
