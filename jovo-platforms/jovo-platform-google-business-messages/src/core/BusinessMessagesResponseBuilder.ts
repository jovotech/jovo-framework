import { ResponseBuilder } from 'jovo-core';
import { BusinessMessagesResponse } from './BusinessMessagesResponse';

export class BusinessMessagesResponseBuilder implements ResponseBuilder<BusinessMessagesResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): BusinessMessagesResponse {
    return BusinessMessagesResponse.fromJSON(json);
  }
}
