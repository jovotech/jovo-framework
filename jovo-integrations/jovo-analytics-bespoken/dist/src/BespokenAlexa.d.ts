import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    key: string;
}
export declare class BespokenAlexa implements Analytics {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
    /**
     * Wraps a request or response to be sent to Bespoken Logless Server
     * @param {Object} payloads Captured request and response
     * @return {object} The request or response ready to be send to logless
     */
    createBespokenLoglessObject(payloads: object[]): {
        logs: {
            log_type: string;
            payload: object;
            tags: string[];
            timestamp: Date;
        }[];
        source: string;
        transaction_id: string;
    };
    sendDataToLogless(payload: Record<string, any>): Promise<void | import("axios").AxiosResponse<any>>;
}
