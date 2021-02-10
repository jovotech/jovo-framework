import { Analytics, BaseApp, HandleRequest, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    key: string;
    appVersion: string;
}
export declare class ChatbaseGoogleAssistant implements Analytics {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
    createChatbaseData(jovo: Jovo): {
        api_key: string;
        intent: string | undefined;
        platform: string;
        session_id: string | undefined;
        time_stamp: number;
        type: string;
        user_id: string | undefined;
        version: string;
    };
    sendDataToChatbase(data: Record<string, any>): Promise<void | import("axios").AxiosResponse<any>>;
}
