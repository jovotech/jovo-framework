import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import { AmazonAlexa } from 'voicehero-sdk';
export interface Config extends PluginConfig {
    key: string;
}
export declare class VoiceHeroAlexa implements Analytics {
    config: Config;
    voicehero: AmazonAlexa;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    track(handleRequest: HandleRequest): void;
}
