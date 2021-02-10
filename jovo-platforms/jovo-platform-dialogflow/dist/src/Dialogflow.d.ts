import { BaseApp, Platform, HandleRequest, ExtensibleConfig } from 'jovo-core';
import { DialogflowRequest } from './core/DialogflowRequest';
import { DialogflowResponse } from './core/DialogflowResponse';
import { DialogflowRequestBuilder } from './core/DialogflowRequestBuilder';
import { DialogflowResponseBuilder } from './core/DialogflowResponseBuilder';
import { DialogflowTestSuite } from './core/Interfaces';
import { DialogflowFactory } from './core/DialogflowFactory';
export interface DialogflowConfig extends ExtensibleConfig {
}
export declare class Dialogflow extends Platform<DialogflowRequest, DialogflowResponse> {
    requestBuilder: DialogflowRequestBuilder<DialogflowFactory>;
    responseBuilder: DialogflowResponseBuilder<DialogflowFactory>;
    config: DialogflowConfig;
    constructor(config?: DialogflowConfig);
    makeTestSuite(): DialogflowTestSuite;
    getAppType(): string;
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    initialize(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    tts(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
}
