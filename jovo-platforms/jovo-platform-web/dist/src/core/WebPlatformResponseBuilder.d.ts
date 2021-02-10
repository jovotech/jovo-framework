import { ResponseBuilder } from 'jovo-core';
import { WebAppResponse } from './WebAppResponse';
export declare class WebPlatformResponseBuilder implements ResponseBuilder<WebAppResponse> {
    create(json: any): WebAppResponse;
}
