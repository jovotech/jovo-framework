import { ResponseBuilder } from 'jovo-core';
import { CorePlatformResponse } from './CorePlatformResponse';

export class CorePlatformResponseBuilder implements ResponseBuilder<CorePlatformResponse> {
  create(json: any): CorePlatformResponse {
    // tslint:disable-line
    return CorePlatformResponse.fromJSON(json);
  }
}
