import { ResponseBuilder } from 'jovo-core';
import { AutopilotResponse } from './AutopilotResponse';

export class AutopilotResponseBuilder implements ResponseBuilder<AutopilotResponse> {
  create(json: any): AutopilotResponse { // tslint:disable-line:no-any
    return AutopilotResponse.fromJSON(json);
  }
}
