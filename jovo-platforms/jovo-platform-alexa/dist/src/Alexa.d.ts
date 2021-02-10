import { BaseApp, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { AlexaRequest } from './core/AlexaRequest';
import { AlexaResponse } from './core/AlexaResponse';
import { AlexaTestSuite } from './core/Interfaces';
import { AlexaRequestBuilder } from './core/AlexaRequestBuilder';
import { AlexaResponseBuilder } from './core/AlexaResponseBuilder';
export interface Config extends ExtensibleConfig {
    allowedSkillIds: string[];
    defaultResponseOnFail: boolean;
    handlers?: any;
}
export declare class Alexa extends Platform<AlexaRequest, AlexaResponse> {
    requestBuilder: AlexaRequestBuilder;
    responseBuilder: AlexaResponseBuilder;
    config: Config;
    constructor(config?: Config);
    getAppType(): string;
    install(app: BaseApp): void;
    makeTestSuite(): AlexaTestSuite;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    tts(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    uninstall(app: BaseApp): void;
}
