import { ResponseBuilder } from 'jovo-core';
import { LindenbaumResponse } from './LindenbaumResponse';

export class LindenbaumResponseBuilder implements ResponseBuilder<LindenbaumResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): LindenbaumResponse {
    return LindenbaumResponse.fromJSON(json);
  }
}
