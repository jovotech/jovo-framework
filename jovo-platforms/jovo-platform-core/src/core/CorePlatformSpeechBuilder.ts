import { SpeechBuilder } from 'jovo-core';
import { CorePlatformApp } from './CorePlatformApp';

export class CorePlatformSpeechBuilder extends SpeechBuilder {
  constructor(corePlatformApp: CorePlatformApp) {
    super(corePlatformApp);
  }
}
