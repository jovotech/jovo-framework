import { BaseApp } from 'jovo-core';
import { Config, CorePlatform } from 'jovo-platform-core';
import { WebApp } from './core/WebApp';
import { WebAppRequest } from './core/WebAppRequest';
import { WebAppResponse } from './core/WebAppResponse';
import { WebPlatformRequestBuilder } from './core/WebPlatformRequestBuilder';
import { WebPlatformResponseBuilder } from './core/WebPlatformResponseBuilder';
export declare class WebPlatform extends CorePlatform<WebAppRequest, WebAppResponse> {
    constructor(config?: Config);
    install(app: BaseApp): void;
    getAppType(): string;
    protected get appClass(): typeof WebApp;
    protected augmentJovoPrototype(): void;
    protected getRequestBuilder(): WebPlatformRequestBuilder;
    protected getResponseBuilder(): WebPlatformResponseBuilder;
}
