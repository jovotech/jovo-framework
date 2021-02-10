import { Plugin, PluginConfig } from 'jovo-core';
import { CorePlatform, CorePlatformApp } from '../../src';
interface Config extends PluginConfig {
}
export declare class RequestSLU implements Plugin {
    config: Config;
    install(corePlatform: CorePlatform): void;
    nlu(corePlatformApp: CorePlatformApp): Promise<void>;
    inputs(corePlatformApp: CorePlatformApp): Promise<void>;
}
export {};
