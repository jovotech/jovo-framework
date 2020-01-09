import { BaseApp, HandleRequest, Host, Jovo } from 'jovo-core';
import { CorePlatformResponse } from './CorePlatformResponse';
import { CorePlatformSpeechBuilder } from './CorePlatformSpeechBuilder';
import { CorePlatformUser } from './CorePlatformUser';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformApp extends Jovo {
  $corePlatformApp: CorePlatformApp;
  $user!: CorePlatformUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$corePlatformApp = this;
    this.$response = new CorePlatformResponse();
    this.$speech = new CorePlatformSpeechBuilder(this);
    this.$reprompt = new CorePlatformSpeechBuilder(this);
  }

  getDeviceId(): string | undefined {
    return undefined;
  }

  getLocale(): string | undefined {
    return this.$request ? this.$request.getLocale() : undefined;
  }

  getPlatformType(): string {
    return 'CorePlatform';
  }

  getRawText(): string | undefined {
    return this.$request ? (this.$request as CorePlatformRequest).text : undefined;
  }

  getSelectedElementId(): string | undefined {
    return undefined;
  }

  getTimestamp(): string | undefined {
    return this.$request ? this.$request.getTimestamp() : undefined;
  }

  getType(): string | undefined {
    return 'CorePlatformApp';
  }

  hasAudioInterface(): boolean {
    return (this.$request as CorePlatformRequest).hasAudioInterface();
  }

  hasScreenInterface(): boolean {
    return (this.$request as CorePlatformRequest).hasScreenInterface();
  }

  hasVideoInterface(): boolean {
    return (this.$request as CorePlatformRequest).hasVideoInterface();
  }

  hasTextInput(): boolean {
    return (this.$request as CorePlatformRequest).hasTextInput();
  }

  isNewSession(): boolean {
    return this.$request ? this.$request.isNewSession() : false;
  }

  speechBuilder(): CorePlatformSpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  getSpeechBuilder(): CorePlatformSpeechBuilder | undefined {
    return new CorePlatformSpeechBuilder(this);
  }
}
