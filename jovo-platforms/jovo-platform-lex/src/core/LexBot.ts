import { Jovo, BaseApp, Host, HandleRequest, AudioData } from 'jovo-core';
import { LexSpeechBuilder } from './LexSpeechBuilder';
import { LexResponse } from './LexResponse';
import { LexUser } from './LexUser';
import { LexRequest } from './LexRequest';

export class LexBot extends Jovo {
  $lexBot: LexBot;
  // @ts-ignore
  $user: LexUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$lexBot = this;
    this.$response = new LexResponse();
    this.$speech = new LexSpeechBuilder(this);
    // $reprompt object has to be added even if the platform doesn't use it.
    // Is used by users as platform independent feature
    this.$reprompt = new LexSpeechBuilder(this);
    this.$output.Lex = {};
  }

  isNewSession(): boolean {
    return this.$request!.isNewSession();
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

  getSpeechBuilder(): LexSpeechBuilder {
    return new LexSpeechBuilder(this);
  }

  speechBuilder(): LexSpeechBuilder {
    return this.getSpeechBuilder();
  }

  getDeviceId(): undefined {
    return undefined;
  }

  getRawText(): string {
    const request = this.$request as LexRequest;
    return request.getRawText();
  }

  getTimestamp(): string {
    return this.$request!.getTimestamp();
  }

  getLocale(): string {
    return this.$request!.getLocale();
  }

  getType(): string {
    return 'LexBot';
  }

  getPlatformType(): string {
    return 'Lex';
  }

  getSelectedElementId(): undefined {
    return undefined;
  }

  getAudioData(): AudioData | undefined {
    return undefined;
  }
}
