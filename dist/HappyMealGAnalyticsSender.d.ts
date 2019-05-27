import { GoogleAnalyticsSender, Config } from "./GoogleAnalyticsSender";
import { BaseApp, Jovo, HandleRequest } from "jovo-core";
export declare class HappyMealGAnalyticsSender extends GoogleAnalyticsSender {
    constructor(config?: Config);
    install(app: BaseApp): void;
    sendUserTransaction(jovo: Jovo, transactionId: string): void;
    sendSessionsPlayedCount(handleRequest: HandleRequest): void;
}
