import { ResponseBuilder } from 'jovo-core';
import { BixbyResponse } from './BixbyResponse';

export class BixbyResponseBuilder implements ResponseBuilder<BixbyResponse> {
  // tslint:disable:no-any
  create(json: any) {
    return BixbyResponse.fromJSON(json);
  }
}
