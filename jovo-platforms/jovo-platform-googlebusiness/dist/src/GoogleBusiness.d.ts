import { BaseApp, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { GoogleBusinessRequest } from './core/GoogleBusinessRequest';
import { GoogleBusinessResponse } from './core/GoogleBusinessResponse';
import { GoogleBusinessTestSuite, GoogleServiceAccount } from './index';
export interface Config extends ExtensibleConfig {
    locale?: string;
    serviceAccount?: GoogleServiceAccount;
}
export declare class GoogleBusiness extends Platform<GoogleBusinessRequest, GoogleBusinessResponse> {
    static type: string;
    static appType: string;
    config: Config;
    constructor(config?: Config);
    getAppType(): string;
    install(app: BaseApp): void;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    session(handleRequest: HandleRequest): Promise<any>;
    tts(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    makeTestSuite(): GoogleBusinessTestSuite;
}
