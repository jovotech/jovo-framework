import { Extensible, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    token?: string;
    minConfidence?: number;
    asr?: {
        enabled?: boolean;
    };
    nlu?: {
        enabled?: boolean;
    };
}
export declare class WitAiSlu implements Plugin {
    config: Config;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    asr(jovo: Jovo): Promise<void>;
    nlu(jovo: Jovo): Promise<void>;
    inputs(jovo: Jovo): Promise<void>;
    private speechToText;
    private naturalLanguageProcessing;
    private validateConfig;
}
