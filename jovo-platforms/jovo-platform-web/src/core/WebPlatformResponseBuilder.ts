import { ResponseBuilder } from 'jovo-core';
import { WebAppResponse } from './WebAppResponse';

export class WebPlatformResponseBuilder implements ResponseBuilder<WebAppResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): WebAppResponse {
    return WebAppResponse.fromJSON(json);
  }
}
