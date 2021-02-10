import { BaseApp, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { GoogleActionRequest } from './core/GoogleActionRequest';
import { GoogleActionResponse } from './core/GoogleActionResponse';
import { GoogleAssistantRequestBuilder } from './core/GoogleAssistantRequestBuilder';
import { GoogleAssistantResponseBuilder } from './core/GoogleAssistantResponseBuilder';
import { GoogleAssistantTestSuite } from './core/Interfaces';
export interface Config extends ExtensibleConfig {
    handlers?: any;
    transactions?: {
        androidPackageName?: string;
        keyFile?: object;
    };
}
export declare class GoogleAssistant extends Platform<GoogleActionRequest, GoogleActionResponse> {
    config: Config;
    requestBuilder: GoogleAssistantRequestBuilder;
    responseBuilder: GoogleAssistantResponseBuilder;
    constructor(config?: Config);
    getAppType(): string;
    install(app: BaseApp): void;
    makeTestSuite(): GoogleAssistantTestSuite;
    initDialogflow(): void;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    uninstall(app: BaseApp): void;
}
