import { SpeechBuilder } from 'jovo-core';
import { CorePlatformApp } from './CorePlatformApp';

export class CorePlatformSpeechBuilder extends SpeechBuilder {
  constructor(assistantSkill: CorePlatformApp) {
    super(assistantSkill);
  }
}
