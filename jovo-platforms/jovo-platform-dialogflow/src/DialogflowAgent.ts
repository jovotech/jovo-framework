import { BaseApp, Jovo, Host, SpeechBuilder, HandleRequest, AudioData } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { DialogflowUser } from './DialogflowUser';

export type SupportedIntegration = 'FacebookMessenger' | 'Slack';

export class DialogflowAgent extends Jovo {
  $dialogflowAgent: DialogflowAgent;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$dialogflowAgent = this;
    this.$user = new DialogflowUser(this);
  }

  /**
   * Returns locale of the request
   * @deprecated use this.$request.getLocale() instead
   * @return {string}
   */
  getLocale(): string {
    return this.$request!.getLocale();
  }

  /**
   * Returns timestamp of a user's request
   * @return {string | undefined}
   */
  getTimestamp() {
    return this.$request!.getTimestamp();
  }

  // dialogflowAgent(): DialogflowAgent {
  //     return this;
  // }

  /**
   * Returns source of request payload
   */
  getSource() {
    return _get(this.$request, 'originalDetectIntentRequest.source');
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
   * Google Assistant doesn't return a device id
   * @return {string | undefined}
   */
  getDeviceId(): string | undefined {
    return undefined;
  }

  /**
   * Returns raw text of request.
   * @return {string | undefined}
   */
  getRawText(): string | undefined {
    return _get(this.$request!, 'queryResult.queryText');
  }

  /**
   * Returns audio data of request.
   * Not supported by this platform.
   * @return {undefined}
   */
  getAudioData(): AudioData | undefined {
    return undefined;
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  speechBuilder(): SpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  getSpeechBuilder(): SpeechBuilder | undefined {
    return new SpeechBuilder(this);
  }

  /**
   * Returns audio capability of request device
   * @public
   * @return {boolean}
   */
  hasAudioInterface(): boolean {
    return false;
  }

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  hasScreenInterface(): boolean {
    return false;
  }

  /**
   * Returns video capability of request device
   * @public
   * @return {boolean}
   */
  hasVideoInterface(): boolean {
    return false;
  }

  /**
   * Returns type of platform ("AlexaSkill","GoogleAction")
   * @public
   * @return {string}
   */
  getType() {
    return 'DialogflowAgent';
  }

  /**
   * Returns type of platform type
   * @public
   * @return {string}
   */
  getPlatformType() {
    return 'Dialogflow';
  }

  /**
   * Returs id of the touched/selected item
   * @public
   * @return {*}
   */
  getSelectedElementId(): string | undefined {
    return undefined;
  }

  setCustomPayload(platform: string, payload: object) {
    _set(this.$output, 'Dialogflow.Payload.' + platform, payload);
  }
}
