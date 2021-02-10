import { InitOptions } from 'i18next';
import { BaseApp, BaseCmsPlugin, HandleRequest, PluginConfig } from 'jovo-core';
export interface Config extends InitOptions, PluginConfig {
    filesDir?: string;
}
export declare class I18Next extends BaseCmsPlugin {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    loadFiles(handleRequest: HandleRequest): Promise<void>;
}
