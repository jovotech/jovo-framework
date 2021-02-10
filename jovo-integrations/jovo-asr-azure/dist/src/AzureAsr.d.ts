import { Extensible, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    endpointKey?: string;
    endpointRegion?: string;
    language?: string;
}
export declare class AzureAsr implements Plugin {
    config: Config;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    asr(jovo: Jovo): Promise<void>;
    private speechToText;
    private validateConfig;
}
