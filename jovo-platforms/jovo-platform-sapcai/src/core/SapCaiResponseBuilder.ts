import { SapCaiResponse } from './SapCaiResponse';
import { ResponseBuilder } from 'jovo-core';

export class SapCaiResponseBuilder implements ResponseBuilder<SapCaiResponse> {
  create(json: any): SapCaiResponse {
    // tslint:disable-line
    return SapCaiResponse.fromJSON(json);
  }
}
