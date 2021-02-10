import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import PulseLabsRecorder = require('pulselabs-recorder');
import { InitOptions } from 'pulselabs-recorder/dist/interfaces/init-options.interface';
export interface Config extends PluginConfig {
    apiKey: string;
    options?: InitOptions;
}
export declare class PulseLabs implements Plugin {
    config: Config;
    pulse: PulseLabsRecorder;
    constructor(config?: Config);
    install(app: BaseApp): void;
    logData(handleRequest: HandleRequest): Promise<void>;
}
