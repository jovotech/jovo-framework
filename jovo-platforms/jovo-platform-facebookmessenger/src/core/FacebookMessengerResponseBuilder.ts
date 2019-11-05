import { ResponseBuilder } from 'jovo-core';
import { MessengerBotResponse } from './MessengerBotResponse';

export class FacebookMessengerResponseBuilder implements ResponseBuilder<MessengerBotResponse> {
  // tslint:disable-next-line:no-any
  create(json: any): MessengerBotResponse {
    return MessengerBotResponse.fromJSON(json);
  }
}
