import { BaseApp, HandleRequest, Host, Jovo, Log } from 'jovo-core';

import { BusinessMessages } from '../BusinessMessages';
import { BusinessMessagesRequest } from './BusinessMessagesRequest';
import { BusinessMessagesResponse } from './BusinessMessagesResponse';
import { BusinessMessagesSpeechBuilder } from './BusinessMessagesSpeechBuilder';
import { BusinessMessagesUser } from './BusinessMessagesUser';

export class BusinessMessagesBot extends Jovo {
  $businessMessagesBot: BusinessMessagesBot;
  $user: BusinessMessagesUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$businessMessagesBot = this;
    this.$response = new BusinessMessagesResponse();
    this.$speech = new BusinessMessagesSpeechBuilder(this);
    // $reprompt object has to be added even if the platform doesn't use it.
    // Is used by users as platform independent feature
    this.$reprompt = new BusinessMessagesSpeechBuilder(this);
    this.$user = new BusinessMessagesUser(this);
    this.$output.BusinessMessages = {};
  }

  isNewSession(): boolean {
    if (this.$user.$session) {
      return this.$user.$session.id !== this.$request!.getSessionId();
    } else {
      return false;
    }
  }

  hasAudioInterface(): boolean {
    return this.$request!.hasAudioInterface();
  }

  hasScreenInterface(): boolean {
    return this.$request!.hasScreenInterface();
  }

  hasVideoInterface(): boolean {
    return this.$request!.hasVideoInterface();
  }

  getSpeechBuilder(): BusinessMessagesSpeechBuilder {
    return new BusinessMessagesSpeechBuilder(this);
  }

  speechBuilder(): BusinessMessagesSpeechBuilder {
    return this.getSpeechBuilder();
  }

  getDeviceId(): string | undefined {
    Log.warn("Google Business Messages doesn't provide a device ID");
    return;
  }

  getRawText(): string | undefined {
    return (this.$request! as BusinessMessagesRequest).getRawText();
  }

  getAudioData(): undefined {
    return undefined;
  }

  getTimestamp(): string | undefined {
    return this.$request?.getTimestamp();
  }

  getLocale(): string | undefined {
    return this.$request?.getLocale();
  }

  getType(): string | undefined {
    return BusinessMessages.appType;
  }

  getPlatformType(): string {
    return BusinessMessages.type;
  }

  getSelectedElementId(): string | undefined {
    return undefined;
  }
}
