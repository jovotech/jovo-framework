import { Google } from 'dashbot';
import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    key: string;
}
export declare class DashbotGoogleAssistant implements Analytics {
    config: Config;
    dashbot: Google;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
}
