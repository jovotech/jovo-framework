import { Extensible, HandleRequest, Inputs, Jovo, Plugin, PluginConfig } from 'jovo-core';
export declare type SetupModelFunction = (handleRequest: HandleRequest, nlpManager: any) => void | Promise<void>;
export interface Config extends PluginConfig {
    languages?: string[];
    preTrainedModelFilePath?: string;
    useModel?: boolean;
    modelsPath?: string;
    setupModelCallback?: SetupModelFunction;
}
export declare class NlpjsNlu implements Plugin {
    config: Config;
    nlp: any;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    setup(handleRequest: HandleRequest): Promise<void>;
    nlu(jovo: Jovo): Promise<void>;
    inputs(jovo: Jovo): Promise<Inputs | undefined>;
    train(): Promise<void>;
    private addCorpus;
}
