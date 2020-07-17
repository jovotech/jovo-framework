import { SpeechBuilder } from 'jovo-core';

import { GoogleBusinessBot } from './GoogleBusinessBot';

export class GoogleBusinessSpeechBuilder extends SpeechBuilder {
  constructor(googleBusinessBot: GoogleBusinessBot) {
    super(googleBusinessBot);
  }
}
