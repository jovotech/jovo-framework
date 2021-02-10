import { RequestBuilder } from 'jovo-core';
import { CorePlatformRequestBuilder } from 'jovo-platform-core';
import { WebAppRequest } from './WebAppRequest';
export declare class WebPlatformRequestBuilder extends CorePlatformRequestBuilder<WebAppRequest> implements RequestBuilder<WebAppRequest> {
    type: string;
    protected requestClass: typeof WebAppRequest;
}
