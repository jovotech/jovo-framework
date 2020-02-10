import { Jovo, BaseApp, Host, HandleRequest, AudioData } from 'jovo-core';
import { AutopilotSpeechBuilder } from './AutopilotSpeechBuilder';
import { AutopilotResponse } from './AutopilotResponse';
import { AutopilotUser } from './AutopilotUser';

export class AutopilotBot extends Jovo {
  $autopilotBot: AutopilotBot;
  // @ts-ignore
  $user: AutopilotUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$autopilotBot = this;
    this.$response = new AutopilotResponse();
    this.$speech = new AutopilotSpeechBuilder(this);
    // $reprompt object has to be added even if the platform doesn't use it.
    // Is used by users as platform independent feature
    this.$reprompt = new AutopilotSpeechBuilder(this);
    this.$output.Autopilot = {};
  }

  isNewSession(): boolean {
    // undefined if no active DB
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

  getSpeechBuilder(): AutopilotSpeechBuilder {
    return new AutopilotSpeechBuilder(this);
  }

  speechBuilder(): AutopilotSpeechBuilder {
    return this.getSpeechBuilder();
  }

  getDeviceId(): undefined {
    return undefined;
  }

  getRawText(): string {
    // return this.$request!.getRawText();
    return '';
  }

  getTimestamp(): string {
    return this.$request!.getTimestamp();
  }

  getLocale(): string {
    return this.$request!.getLocale();
  }

  getType(): string {
    return 'AutopilotBot';
  }

  getPlatformType(): string {
    return 'Autopilot';
  }

  getSelectedElementId(): undefined {
    return undefined;
  }

  setActions(actions: object[]): this {
    const response = this.$response as AutopilotResponse;
    response.actions = actions;

    return this;
  }

  getAudioData(): AudioData | undefined {
    return undefined;
  }
}
