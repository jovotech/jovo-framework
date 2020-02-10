import { Jovo, BaseApp, Host, HandleRequest, AudioData } from 'jovo-core';
import { BixbyResponse } from './BixbyResponse';
import { BixbySpeechBuilder } from './BixbySpeechBuilder';
import { BixbyUser } from '../modules/BixbyUser';
import { BixbyAudioPlayer } from '../modules/BixbyAudioPlayer';

export class BixbyCapsule extends Jovo {
  $bixbyCapsule: BixbyCapsule;
  $audioPlayer?: BixbyAudioPlayer;
  // tslint:disable:no-any
  $layout: { [key: string]: any } = {};
  // @ts-ignore
  $user: BixbyUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$bixbyCapsule = this;
    this.$response = new BixbyResponse();
    this.$speech = new BixbySpeechBuilder(this);
    this.$reprompt = new BixbySpeechBuilder(this);
  }

  speechBuilder(): BixbySpeechBuilder {
    return this.getSpeechBuilder();
  }

  getSpeechBuilder(): BixbySpeechBuilder {
    return new BixbySpeechBuilder(this);
  }

  isNewSession() {
    return this.$request!.isNewSession();
  }

  getTimestamp() {
    return this.$request!.getTimestamp();
  }

  getLocale() {
    return this.$request!.getLocale();
  }

  getUserId() {
    return this.$user.getId();
  }

  // tslint:disable:no-any
  addLayoutAttribute(key: string, value: any) {
    this.$layout[key] = value;
  }

  getDeviceId() {
    // TODO implement!
    return undefined;
  }

  hasAudioInterface() {
    // TODO implement, always has audio interface?
    return true;
  }

  hasScreenInterface() {
    // TODO implement, always has screen interface?
    return true;
  }

  hasVideoInterface() {
    // TODO implement, can play videos?
    return false;
  }

  getType() {
    return 'BixbyCapsule';
  }

  getPlatformType() {
    return 'Bixby';
  }

  getSelectedElementId() {
    // TODO what does this do?
    return undefined;
  }

  getRawText() {
    // TODO again, what does this do?
    return undefined;
  }

  getAudioData(): AudioData | undefined {
    return undefined;
  }
}
