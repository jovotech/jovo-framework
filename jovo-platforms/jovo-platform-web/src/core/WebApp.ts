import { BaseApp, HandleRequest, Host } from 'jovo-core';
import { CorePlatformApp } from 'jovo-platform-core';
import { WebAppResponse } from './WebAppResponse';
import { WebAppSpeechBuilder } from './WebAppSpeechBuilder';
import { WebAppUser } from './WebAppUser';

export class WebApp extends CorePlatformApp {
  $webApp: WebApp;
  $user!: WebAppUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$corePlatformApp = undefined;
    this.$webApp = this;
    this.$response = new WebAppResponse();
    this.$speech = new WebAppSpeechBuilder(this);
    this.$reprompt = new WebAppSpeechBuilder(this);
  }

  getType(): string {
    return 'WebApp';
  }

  getPlatformType(): 'WebPlatform' | string {
    return 'WebPlatform';
  }

  speechBuilder(): WebAppSpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  getSpeechBuilder(): WebAppSpeechBuilder | undefined {
    return new WebAppSpeechBuilder(this);
  }
}
