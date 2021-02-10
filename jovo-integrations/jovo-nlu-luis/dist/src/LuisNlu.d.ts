import { Extensible, Inputs, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    endpointKey?: string;
    endpointRegion?: string;
    appId?: string;
    verbose?: boolean;
    defaultIntent?: string;
    slot?: 'production' | 'staging';
}
export declare class LuisNlu implements Plugin {
    config: Config;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    nlu(jovo: Jovo): Promise<void>;
    inputs(jovo: Jovo): Promise<Inputs | undefined>;
    private naturalLanguageProcessing;
    private validateConfig;
}
