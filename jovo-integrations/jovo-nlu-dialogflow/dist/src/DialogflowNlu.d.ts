import { JWT } from 'google-auth-library';
import { Extensible, HandleRequest, Inputs, Jovo, Plugin, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    defaultIntent?: string;
    defaultLocale?: string;
    minConfidence?: number;
    credentialsFile?: string;
    authToken?: string;
    projectId?: string;
    requireCredentialsFile?: boolean;
    getSessionIdCallback?: (jovo: Jovo) => string | Promise<string>;
}
export declare class DialogflowNlu implements Plugin {
    config: Config;
    constructor(config?: Config);
    parentName?: string;
    jwtClient?: JWT;
    get name(): string;
    install(parent: Extensible): void;
    setup(handleRequest: HandleRequest): Promise<void>;
    afterInit(handleRequest: HandleRequest): Promise<void>;
    nlu(jovo: Jovo): Promise<void>;
    inputs(jovo: Jovo): Promise<Inputs | undefined>;
    private initializeJWT;
    private naturalLanguageProcessing;
}
