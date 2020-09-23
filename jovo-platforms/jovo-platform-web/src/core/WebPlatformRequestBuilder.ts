import { RequestBuilder } from 'jovo-core';
import { CorePlatformRequestBuilder } from 'jovo-platform-core';
import { WebAppRequest } from './WebAppRequest';

export class WebPlatformRequestBuilder extends CorePlatformRequestBuilder<WebAppRequest>
  implements RequestBuilder<WebAppRequest> {
  type = 'WebApp';
  protected requestClass = WebAppRequest;
}
