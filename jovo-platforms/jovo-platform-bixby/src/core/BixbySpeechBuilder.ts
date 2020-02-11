import { SpeechBuilder } from 'jovo-core';
import { BixbyCapsule } from './BixbyCapsule';

export class BixbySpeechBuilder extends SpeechBuilder {
  constructor(capsule: BixbyCapsule) {
    super(capsule);
  }
}
