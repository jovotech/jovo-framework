import { BaseApp, ExtensibleConfig, HandleRequest, Platform, TestSuite } from 'jovo-core';
import { SapCaiRequest, SapCaiRequestBuilder, SapCaiResponse, SapCaiResponseBuilder } from '.';
export interface Config extends ExtensibleConfig {
    handlers?: any;
    useLaunch?: boolean;
}
export declare class SapCai extends Platform<SapCaiRequest, SapCaiResponse> {
    requestBuilder: SapCaiRequestBuilder;
    responseBuilder: SapCaiResponseBuilder;
    config: Config;
    constructor(config?: Config);
    getAppType(): string;
    install(app: BaseApp): void;
    makeTestSuite(): TestSuite<SapCaiRequestBuilder, SapCaiResponseBuilder>;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    uninstall(app: BaseApp): void;
}
