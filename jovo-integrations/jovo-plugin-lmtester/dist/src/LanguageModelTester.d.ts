import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    startText: string;
}
export declare class LanguageModelTester implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    testModel(handleRequest: HandleRequest): Promise<void> | undefined;
}
