import { Extensible, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    'x-api-key'?: string;
    'customKeyName'?: string;
    'customKeyValue'?: string;
}
export declare class ApiKey implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(parent: Extensible): void;
    beforerequest(handleRequest: HandleRequest): Promise<void>;
}
