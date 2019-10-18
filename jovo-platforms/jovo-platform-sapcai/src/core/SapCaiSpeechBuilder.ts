import { SpeechBuilder } from 'jovo-core';
import { SapCaiSkill } from './SapCaiSkill';

export class SapCaiSpeechBuilder extends SpeechBuilder {
  constructor(caiSkill: SapCaiSkill) {
    super(caiSkill);
  }
}
