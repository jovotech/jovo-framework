import { ResponseBuilder } from 'jovo-core';
import { AutopilotResponse } from './AutopilotResponse';

export class AutopilotResponseBuilder implements ResponseBuilder<AutopilotResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): AutopilotResponse {
    return AutopilotResponse.fromJSON(json);
  }
}
