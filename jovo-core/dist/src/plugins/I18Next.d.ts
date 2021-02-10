import * as i18next from 'i18next';
import { BaseApp, HandleRequest } from '..';
import { PluginConfig } from '../Interfaces';
import { BaseCmsPlugin } from './BaseCmsPlugin';
export interface Config extends i18next.InitOptions, PluginConfig {
    filesDir?: string;
}
export declare class I18Next extends BaseCmsPlugin {
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    loadFiles(handleRequest: HandleRequest): Promise<void>;
}
