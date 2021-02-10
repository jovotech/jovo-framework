import { BaseApp, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { BixbyRequestBuilder } from './core/BixbyRequestBuilder';
import { BixbyResponseBuilder } from './core/BixbyResponseBuilder';
import { BixbyRequest } from './core/BixbyRequest';
import { BixbyResponse } from '.';
import { BixbyTestSuite } from './core/Interfaces';
export interface Config extends ExtensibleConfig {
}
export declare class Bixby extends Platform<BixbyRequest, BixbyResponse> {
    requestBuilder: BixbyRequestBuilder;
    responseBuilder: BixbyResponseBuilder;
    config: Config;
    constructor(config?: Config);
    getAppType(): string;
    install(app: BaseApp): void;
    makeTestSuite(): BixbyTestSuite;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    fail(): void;
    supportsASR(): boolean;
    supportsTTS(): boolean;
}
