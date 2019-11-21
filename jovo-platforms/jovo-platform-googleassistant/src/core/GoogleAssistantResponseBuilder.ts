import { ResponseBuilder } from 'jovo-core';
import { GoogleActionResponse } from './GoogleActionResponse';

export class GoogleAssistantResponseBuilder implements ResponseBuilder<GoogleActionResponse> {
  // tslint:disable-next-line
  create(json: any): GoogleActionResponse {
    return GoogleActionResponse.fromJSON(json);
  }
}
