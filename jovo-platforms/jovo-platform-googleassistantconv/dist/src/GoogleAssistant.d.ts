import { BaseApp, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { ConversationalActionRequest } from './core/ConversationalActionRequest';
import { ConversationalActionResponse } from './core/ConversationalActionResponse';
import { GoogleAssistantRequestBuilder } from './core/GoogleAssistantRequestBuilder';
import { GoogleAssistantResponseBuilder } from './core/GoogleAssistantResponseBuilder';
import { GoogleAssistantTestSuite } from './core/Interfaces';
export interface Config extends ExtensibleConfig {
    handlers?: any;
}
export declare class GoogleAssistant extends Platform<ConversationalActionRequest, ConversationalActionResponse> {
    config: Config;
    requestBuilder: GoogleAssistantRequestBuilder;
    responseBuilder: GoogleAssistantResponseBuilder;
    constructor(config?: Config);
    getAppType(): string;
    install(app: BaseApp): void;
    makeTestSuite(): GoogleAssistantTestSuite;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    uninstall(app: BaseApp): void;
}
