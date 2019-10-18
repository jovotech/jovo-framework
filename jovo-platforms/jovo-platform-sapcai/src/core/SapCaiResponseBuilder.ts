import { SapCaiResponse } from './SapCaiResponse';
import { ResponseBuilder } from 'jovo-core';

export class SapCaiResponseBuilder implements ResponseBuilder<SapCaiResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): SapCaiResponse {
    return SapCaiResponse.fromJSON(json);
  }
}
