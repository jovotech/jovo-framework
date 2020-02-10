import { SpeechBuilder } from 'jovo-core';
import { AutopilotBot } from './AutopilotBot';

export class AutopilotSpeechBuilder extends SpeechBuilder {
  constructor(autopilotBot: AutopilotBot) {
    super(autopilotBot);
  }
}
