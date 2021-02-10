/// <reference types="socket.io-client" />
import { BaseApp, Plugin, PluginConfig, SessionData } from 'jovo-core';
export interface Config extends PluginConfig {
    database?: boolean;
    languageModel?: boolean;
    languageModelDir?: string;
    debuggerJsonPath?: string;
}
export interface JovoDebuggerRequest {
    json: any;
    platformType: string;
    requestSessionAttributes: SessionData;
    userId: string;
    route?: any;
    inputs?: any;
    rawText?: string;
    database?: any;
    error?: any;
}
export interface JovoDebuggerResponse {
    json: any;
    database?: any;
    speech?: string;
    platformType: string;
    userId: string;
    route: any;
    sessionEnded: boolean;
    inputs: any;
    requestSessionAttributes: any;
    responseSessionAttributes: any;
    audioplayer?: any;
}
export declare class JovoDebugger implements Plugin {
    private static getWebhookId;
    config: Config;
    app?: BaseApp;
    socket?: SocketIOClient.Socket;
    consoleLogOverriden: boolean;
    constructor(config?: Config);
    install(app: BaseApp): Promise<void>;
    private sendRequest;
    private askForLanguageModelEmit;
    private readyToDebug;
    private afterRouting;
    private response;
    private connect;
}
