import { ResponseBuilder } from 'jovo-core';
import { ConversationalActionResponse } from './ConversationalActionResponse';

export class GoogleAssistantResponseBuilder
  implements ResponseBuilder<ConversationalActionResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): ConversationalActionResponse {
    return ConversationalActionResponse.fromJSON(json);
  }
}
