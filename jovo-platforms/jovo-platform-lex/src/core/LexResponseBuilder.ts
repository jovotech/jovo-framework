import { ResponseBuilder } from 'jovo-core';
import { LexResponse } from './LexResponse';

export class LexResponseBuilder implements ResponseBuilder<LexResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): LexResponse {
    return LexResponse.fromJSON(json);
  }
}
