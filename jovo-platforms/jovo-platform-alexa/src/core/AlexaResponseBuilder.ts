import { AlexaResponse } from './AlexaResponse';
import { ResponseBuilder } from 'jovo-core';

export class AlexaResponseBuilder implements ResponseBuilder<AlexaResponse> {
  // tslint:disable-next-line
  create(json: any): AlexaResponse {
    return AlexaResponse.fromJSON(json);
  }
}
