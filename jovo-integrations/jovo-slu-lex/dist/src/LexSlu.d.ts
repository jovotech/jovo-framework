import { Extensible, Inputs, Jovo, Plugin, PluginConfig } from 'jovo-core';
import { AmazonCredentials } from './Interfaces';
export interface Config extends PluginConfig {
    botAlias?: string;
    botName?: string;
    credentials?: Partial<AmazonCredentials>;
    defaultIntent?: string;
    asr?: {
        enabled?: boolean;
    };
    nlu?: {
        enabled?: boolean;
    };
}
export declare class LexSlu implements Plugin {
    config: Config;
    private $lex;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    asr(jovo: Jovo): Promise<void>;
    nlu(jovo: Jovo): Promise<void>;
    inputs(jovo: Jovo): Promise<Inputs | undefined>;
    private speechToText;
    private naturalLanguageProcessing;
    private validateConfig;
}
