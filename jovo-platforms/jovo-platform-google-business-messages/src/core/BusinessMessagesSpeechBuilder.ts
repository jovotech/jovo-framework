import { SpeechBuilder } from 'jovo-core';

import { BusinessMessagesBot } from './BusinessMessagesBot';

export class BusinessMessagesSpeechBuilder extends SpeechBuilder {
  constructor(businessMessagesBot: BusinessMessagesBot) {
    super(businessMessagesBot);
  }
}
