import { ResponseBuilder } from 'jovo-core';
import { GoogleBusinessResponse } from './GoogleBusinessResponse';

export class GoogleBusinessResponseBuilder implements ResponseBuilder<GoogleBusinessResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): GoogleBusinessResponse {
    return GoogleBusinessResponse.fromJSON(json);
  }
}
