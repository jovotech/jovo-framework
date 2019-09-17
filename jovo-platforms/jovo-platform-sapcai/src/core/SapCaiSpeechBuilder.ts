import _sample = require('lodash.sample');
import { SpeechBuilder } from 'jovo-core';
import { SapCaiSkill } from './SapCaiSkill';
import { SsmlElements } from 'jovo-core/dist/src/SpeechBuilder';

export class SapCaiSpeechBuilder extends SpeechBuilder {
  constructor(sapcaiSkill: SapCaiSkill) {
    super(sapcaiSkill);
  }
}
