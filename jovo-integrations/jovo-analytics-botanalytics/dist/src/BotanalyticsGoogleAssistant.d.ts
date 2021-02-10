import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import { GoogleAssistant } from 'botanalytics';
export interface Config extends PluginConfig {
    key: string;
}
export declare class BotanalyticsGoogleAssistant implements Analytics {
    config: Config;
    botanalytics: GoogleAssistant;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
}
