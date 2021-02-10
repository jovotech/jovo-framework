import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import { AmazonAlexa } from 'botanalytics';
export interface Config extends PluginConfig {
    key: string;
}
export declare class BotanalyticsAlexa implements Analytics {
    config: Config;
    botanalytics: AmazonAlexa;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
}
