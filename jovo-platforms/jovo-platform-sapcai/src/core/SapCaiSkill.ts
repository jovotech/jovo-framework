import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';

import { SapCaiResponse } from './SapCaiResponse';
import { SapCaiSpeechBuilder } from './SapCaiSpeechBuilder';
import { SapCaiUser } from './SapCaiUser';

export class SapCaiSkill extends Jovo {
  $caiSkill: SapCaiSkill;
  // @ts-ignore
  $user: SapCaiUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$caiSkill = this;
    this.$response = new SapCaiResponse();
    this.$speech = new SapCaiSpeechBuilder(this);
    this.$reprompt = new SapCaiSpeechBuilder(this);
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  speechBuilder(): SapCaiSpeechBuilder {
    return this.getSpeechBuilder();
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  getSpeechBuilder(): SapCaiSpeechBuilder {
    return new SapCaiSpeechBuilder(this);
  }

  /**
   * Returns boolean if request is part of new session
   * @public
   * @return {boolean}
   */
  isNewSession(): boolean {
    return this.$request!.isNewSession();
  }

  /**
   * Returns timestamp of a user's request
   * @returns {string | undefined}
   */
  getTimestamp() {
    return this.$request!.getTimestamp();
  }

  /**
   * Returns locale of the request
   * @deprecated use this.$request.getLocale() instead
   * @returns {string}
   */
  getLocale(): string {
    return this.$request!.getLocale();
  }

  /**
   * Returns UserID
   * @deprecated Use this.$user.getId() instead.
   * @public
   * @return {string}
   */
  getUserId(): string | undefined {
    return this.$user.getId();
  }

  /**
   * Returns device id
   * @returns {string | undefined}
   */
  getDeviceId() {
    return undefined;
  }

  /**
   * Returns audio capability of request device
   * @public
   * @return {boolean}
   */
  hasAudioInterface() {
    return this.$request!.hasAudioInterface();
  }

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  hasScreenInterface() {
    return this.$request!.hasScreenInterface();
  }

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  hasVideoInterface() {
    return this.$request!.hasVideoInterface();
  }

  /**
   * Returns type of platform jovo implementation
   * @public
   * @return {string}
   */
  getType() {
    return 'SapCaiSkill';
  }

  /**
   * Returns type of platform type
   * @public
   * @return {string}
   */
  getPlatformType() {
    return 'SapCai';
  }

  /**
   * Returns id of the touched/selected item
   * @public
   * @return {*}
   */
  getSelectedElementId() {
    // TODO
    return undefined;
  }

  /**
   * Returns raw text.
   * Only available with catchAll slots
   * @return {string | undefined}
   */
  getRawText() {
    // TODO
    return undefined;
  }

  /**
   * Returns audio data.
   * Not supported by this platform.
   * @Return {undefined}
   */
  getAudioData(): AudioData | undefined {
    return undefined;
  }
}
