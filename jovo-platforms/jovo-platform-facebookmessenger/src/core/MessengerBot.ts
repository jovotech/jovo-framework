import { BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import { MessengerBotSpeechBuilder } from './MessengerBotSpeechBuilder';
import { MessengerBotUser } from './MessengerBotUser';

export class MessengerBot extends Jovo {
  $messengerBot: MessengerBot;

  constructor(app: BaseApp, host: Host, handleRequest: HandleRequest) {
    super(app, host, handleRequest);
    this.$messengerBot = this;
    this.$speech = new MessengerBotSpeechBuilder(this);
    this.$reprompt = new MessengerBotSpeechBuilder(this);
    this.$user = new MessengerBotUser(this);
  }

  getDeviceId(): string | undefined {
    return undefined;
  }

  getLocale(): string | undefined {
    return this.$request ? this.$request.getLocale() : undefined;
  }

  getPlatformType(): string {
    return 'FacebookMessenger';
  }

  getRawText(): string | undefined {
    return (
      _get(this, '$request.messaging[0].message.text') ||
      _get(this, '$request.messaging[0].postback.title')
    );
  }

  getSelectedElementId(): string | undefined {
    return undefined;
  }

  getSpeechBuilder(): SpeechBuilder | undefined {
    return new MessengerBotSpeechBuilder(this);
  }

  getTimestamp(): string | undefined {
    return this.$request ? this.$request.getTimestamp() : undefined;
  }

  getType(): string | undefined {
    return 'MessengerBot';
  }

  hasAudioInterface(): boolean {
    return false;
  }

  hasScreenInterface(): boolean {
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  isNewSession(): boolean {
    return this.$user.isNew();
  }

  speechBuilder(): SpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }
}
