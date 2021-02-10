import { BaseApp, ExtensibleConfig, HandleRequest, Platform, RequestBuilder, ResponseBuilder, TestSuite } from 'jovo-core';
import { ActionType, CorePlatformApp, CorePlatformRequest, CorePlatformResponse } from '.';
export interface Config extends ExtensibleConfig {
    handlers?: any;
    defaultOutputAction: ActionType.Text | ActionType.Speech;
}
export declare class CorePlatform<REQ extends CorePlatformRequest = CorePlatformRequest, RES extends CorePlatformResponse = CorePlatformResponse> extends Platform<REQ, RES> {
    requestBuilder: RequestBuilder<REQ>;
    responseBuilder: ResponseBuilder<RES>;
    config: Config;
    constructor(config?: ExtensibleConfig);
    getAppType(): string;
    install(app: BaseApp): void;
    setup(handleRequest: HandleRequest): Promise<void>;
    initialize(handleRequest: HandleRequest): Promise<void>;
    asr(handleRequest: HandleRequest): Promise<void>;
    nlu(handleRequest: HandleRequest): Promise<void>;
    beforeTTS(handleRequest: HandleRequest): Promise<void>;
    tts(handleRequest: HandleRequest): Promise<void>;
    output(handleRequest: HandleRequest): Promise<void>;
    response(handleRequest: HandleRequest): Promise<void>;
    makeTestSuite(): TestSuite<RequestBuilder<REQ>, ResponseBuilder<RES>>;
    protected get appClass(): typeof CorePlatformApp;
    protected augmentJovoPrototype(): void;
    protected getRequestBuilder(): RequestBuilder<REQ>;
    protected getResponseBuilder(): ResponseBuilder<RES>;
}
