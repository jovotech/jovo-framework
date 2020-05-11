import { SpeechBuilder } from 'jovo-core';
import { LindenbaumBot } from './LindenbaumBot';

export class LindenbaumSpeechBuilder extends SpeechBuilder {
  constructor(lindenbaumBot: LindenbaumBot) {
    super(lindenbaumBot);
  }
}
