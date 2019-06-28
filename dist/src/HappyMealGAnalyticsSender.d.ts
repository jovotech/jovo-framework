import { GoogleAnalyticsSender, Config } from "./GoogleAnalyticsSender";
import { BaseApp, HandleRequest } from "jovo-core";
export declare class HappyMealGAnalyticsSender extends GoogleAnalyticsSender {
    constructor(config?: Config);
    install(app: BaseApp): void;
    sendSessionsPlayedCount(handleRequest: HandleRequest): void;
}
