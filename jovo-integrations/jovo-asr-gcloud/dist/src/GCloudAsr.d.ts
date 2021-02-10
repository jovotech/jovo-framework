import { JWT } from 'google-auth-library';
import { Extensible, HandleRequest, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    credentialsFile?: string;
    locale?: string;
}
export declare class GCloudAsr implements Plugin {
    config: Config;
    jwtClient?: JWT;
    constructor(config?: Config);
    get name(): string;
    install(parent: Extensible): void;
    setup(handleRequest: HandleRequest): Promise<void>;
    asr(jovo: Jovo): Promise<void>;
    private speechToText;
    private initializeJWT;
}
