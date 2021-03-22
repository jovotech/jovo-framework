import { SpeechBuilder } from 'jovo-core';
import { LexBot } from './LexBot';

export class LexSpeechBuilder extends SpeechBuilder {
  constructor(lexBot: LexBot) {
    super(lexBot);
  }
}
