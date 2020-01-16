import { ResponseBuilder } from 'jovo-core';
import { CorePlatformResponse } from './CorePlatformResponse';

export class CorePlatformResponseBuilder implements ResponseBuilder<CorePlatformResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): CorePlatformResponse {
    return CorePlatformResponse.fromJSON(json);
  }
}
