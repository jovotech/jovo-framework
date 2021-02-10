import { Extensible, Inputs, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    endpoint?: string;
}
export declare class RasaNlu implements Plugin {
    config: Config;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    nlu(jovo: Jovo): Promise<void>;
    inputs(jovo: Jovo): Promise<Inputs | undefined>;
    private naturalLanguageProcessing;
    private validateConfig;
}
