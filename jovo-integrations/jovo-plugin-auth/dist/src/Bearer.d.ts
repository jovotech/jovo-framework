import { Extensible, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    bearer: string;
}
export declare class Bearer implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(parent: Extensible): void;
    beforerequest(handleRequest: HandleRequest): Promise<void>;
}
