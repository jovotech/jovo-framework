import { Extensible, ExtensibleConfig, HandleRequest, Jovo, Platform } from 'jovo-core';
import { PlatformFactory } from '../index';
export interface DialogflowPluginConfig extends ExtensibleConfig {
    sessionContextId?: string;
}
export declare class DialogflowPlugin<T extends Extensible> extends Extensible {
    private factory;
    config: DialogflowPluginConfig;
    constructor(config: DialogflowPluginConfig, factory: PlatformFactory);
    install(platform: Extensible & Platform): void;
    init: (handleRequest: HandleRequest) => Promise<void>;
    request: (jovo: Jovo) => void;
    type: (jovo: Jovo) => void;
    nlu: (jovo: Jovo) => void;
    inputs: (jovo: Jovo) => void;
    session: (jovo: Jovo) => void;
    output: (jovo: Jovo) => void;
    response: (jovo: Jovo) => void;
}
