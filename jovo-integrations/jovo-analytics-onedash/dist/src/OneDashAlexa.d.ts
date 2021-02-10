import { Analytics, BaseApp, HandleRequest, Inputs, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    key: string;
}
export declare class OneDashAlexa implements Analytics {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
    createOneDashData(jovo: Jovo): {
        messages: {
            api_key: string;
            message: string;
            platform: string;
            session_id: string;
            time_stamp: number;
            type: string;
            user_id: string;
        }[];
    };
    buildMessages(jovo: Jovo, timeStamp: number, sessionId: string, responseMessage: string): {
        messages: {
            api_key: string;
            message: string;
            platform: string;
            session_id: string;
            time_stamp: number;
            type: string;
            user_id: string;
        }[];
    };
    buildAgentMessage(userId: string, message: string, sessionId: string): {
        api_key: string;
        message: string;
        platform: string;
        session_id: string;
        time_stamp: number;
        type: string;
        user_id: string;
    };
    buildUserMessage(jovo: Jovo, userId: string, timeStamp: number, sessionId: string): {
        api_key: string;
        intent: string;
        message: string;
        not_handled: boolean;
        platform: string;
        session_id: string;
        time_stamp: number;
        type: string;
        user_id: string;
    };
    buildMessage(intentName: string, intentSlots: Inputs): string;
    /**
     * Takes an Inputs object, and converts it into a readable string for analtyics
     * @param intentSlots All of the slots passed to the intent
     */
    buildMessageSlotString(intentSlots: Inputs): string;
    sendDataToOneDash(data: Record<string, any>): Promise<void | import("axios").AxiosResponse<any>>;
}
