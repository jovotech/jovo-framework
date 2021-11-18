import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';
import { ConversationalActionRequest } from './ConversationalActionRequest';
import {
  Capability,
  ConversationalSession,
  Intent,
  PermissionStatus,
  Reprompt,
  Suggestion,
  PermissionResult,
  Prompt,
} from './Interfaces';
import { ConversationalActionUser } from './ConversationalActionUser';
import { ConversationalActionResponse } from './ConversationalActionResponse';
import { GoogleActionSpeechBuilder } from './GoogleActionSpeechBuilder';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { ConversationalScene } from './ConversationalScene';

const _sample = require('lodash.sample');

export class GoogleAction extends Jovo {
  $user: ConversationalActionUser;

  $conversationalSession: ConversationalSession = {};
  $scene?: ConversationalScene;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$googleAction = this;
    // this.platformRequest = platformRequest;
    this.$speech = new GoogleActionSpeechBuilder(this);
    this.$reprompt = new GoogleActionSpeechBuilder(this);
    this.$output.GoogleAssistant = {};
    this.$request = ConversationalActionRequest.fromJSON(
      this.$host.getRequestObject(),
    ) as ConversationalActionRequest;
    this.$response = new ConversationalActionResponse();
    this.$user = new ConversationalActionUser(this);
    const scene = (this.$request as ConversationalActionRequest).scene;
    if (scene) {
      this.$scene = new ConversationalScene(scene);
    }
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

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  speechBuilder(): GoogleActionSpeechBuilder {
    return this.getSpeechBuilder();
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  getSpeechBuilder(): GoogleActionSpeechBuilder {
    return new GoogleActionSpeechBuilder(this);
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
   * Says speech and waits for answer from user.
   * Reprompt when user input fails.
   * Keeps session open.
   * @public
   * @param {string|SpeechBuilder} speech
   * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} reprompt
   * @param {reprompt[]} reprompts additional reprompts
   */
  ask(
    speech: string | SpeechBuilder | string[],
    reprompt: string | SpeechBuilder | string[],
    ...reprompts: Reprompt[]
  ) {
    delete this.$output.tell;

    if (Array.isArray(speech)) {
      speech = _sample(speech);
    }

    if (Array.isArray(reprompt)) {
      reprompt = _sample(reprompt);
    }

    if (!reprompt) {
      reprompt = speech;
    }

    _set(this.$output, 'ask.speech', speech.toString());
    _set(this.$output, 'ask.reprompt', reprompt.toString());

    if (reprompts) {
      this.$output.ask!.reprompt = [reprompt.toString()];
      reprompts.forEach((repr: string | SpeechBuilder) => {
        (this.$output.ask!.reprompt as string[]).push(repr.toString());
      });
    }

    return this;
  }

  /**
   * Returns web browser capability of request device
   * @public
   * @return {boolean}
   */
  hasWebBrowserInterface(): boolean {
    return (this.$request! as ConversationalActionRequest).hasWebBrowserInterface();
  }

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  hasScreenInterface() {
    return (this.$request! as ConversationalActionRequest).hasScreenInterface();
  }

  /**
   * Returns audio capability of request device
   * @public
   * @return {boolean}
   */
  hasAudioInterface() {
    return (this.$request! as ConversationalActionRequest).hasAudioInterface();
  }

  hasLongFormAudioInterface() {
    const request = this.$request! as ConversationalActionRequest;
    if (request.device) {
      return !!request.device.capabilities.find((cap: Capability) => cap === 'LONG_FORM_AUDIO');
    }
  }

  setNextScene(scene: string) {
    _set(this.$output, 'GoogleAssistant.nextScene', scene);
    return this;
  }

  endConversation() {
    this.setNextScene('actions.scene.END_CONVERSATION');
    return this;
  }

  endSession() {
    return this.endConversation();
  }

  /**
   * Returns interactive canvas capability of request device
   * @public
   * @return {boolean}
   */
  hasInteractiveCanvasInterface() {
    const request = this.$request! as ConversationalActionRequest;
    if (request.device) {
      return !!request.device.capabilities.find((cap: Capability) => cap === 'INTERACTIVE_CANVAS');
    }
  }

  /**
   * Returns array of availiable surfaces
   * @return {Array<string>}
   */
  getAvailableSurfaces() {
    // TODO:
  }

  /**
   * Returns video capability of request device
   * @public
   * @return {boolean}
   */
  hasVideoInterface() {
    return false;
  }

  /**
   * Google Assistant doesn't return a device id
   * @return {string | undefined}
   */
  getDeviceId() {
    return undefined;
  }

  /**
   * Returns type of platform ("AlexaSkill","GoogleAction")
   * @public
   * @return {string}
   */
  getType() {
    return 'GoogleAction';
  }

  /**
   * Returns type of platform type
   * @public
   * @return {string}
   */
  getPlatformType() {
    return 'GoogleAssistant';
  }

  /**
   * Returns raw text of request.
   * @return {string | undefined}
   */
  getRawText() {
    const request = this.$request! as ConversationalActionRequest;
    return request.intent?.query;
  }

  /**
   * Returns audio data of request.
   * Not supported by this platform.
   * @return {undefined}
   */
  getAudioData(): AudioData | undefined {
    return undefined;
  }

  isInSandbox() {
    throw new Error('Not supported anymore');
  }

  /**
   * Returns user's verification status
   */
  isVerifiedUser(): boolean {
    const request = this.$request! as ConversationalActionRequest;
    return request.user?.verificationStatus === 'VERIFIED';
  }

  getSelectedElementId(): string | undefined {
    const request = this.$request! as ConversationalActionRequest;
    return request.intent?.params?.prompt_option?.resolved as string;
  }

  /**
   * Returns the project id that is associated with this Google Action
   */
  getProjectId(): string {
    const queryParams = this.$host.getQueryParams();
    return queryParams['projectId'];
  }

  hasMediaResponseInterface(): boolean {
    return (this.$request! as ConversationalActionRequest).hasLongFormAudioInterface();
  }

  showSuggestions(suggestions: string[]) {
    const suggestionsList: Suggestion[] = suggestions.map((item: string) => {
      return {
        title: item,
      };
    });
    _set(this.$output, 'GoogleAssistant.suggestions', suggestionsList);
  }
  isAccountLinkingRejected() {
    return (
      (this.$request as ConversationalActionRequest).intent?.params?.AccountLinkingSlot
        ?.resolved === 'REJECTED'
    );
  }
  isAccountLinkingLinked() {
    return (
      (this.$request as ConversationalActionRequest).intent?.params?.AccountLinkingSlot
        ?.resolved === 'LINKED'
    );
  }

  getPermissionResult(): PermissionResult | undefined {
    for (const [key, value] of Object.entries(
      (this.$request! as ConversationalActionRequest).intent!.params,
    )) {
      if (key.startsWith('NotificationsSlot_')) {
        return value.resolved as PermissionResult;
      }
    }
  }

  getPermissionStatus() {
    return this.getPermissionResult()?.permissionStatus;
  }

  isPermissionDenied() {
    return this.getPermissionStatus() === 'PERMISSION_DENIED';
  }
  isPermissionGranted() {
    return this.getPermissionStatus() === 'PERMISSION_GRANTED';
  }

  isPermissionAlreadyGranted() {
    return this.getPermissionStatus() === 'ALREADY_GRANTED';
  }

  getNotificationsUserId() {
    return this.getPermissionResult()?.additionalUserData.updateUserId;
  }
  prompt(prompt: Prompt): this {
    this.$output.GoogleAssistant.prompt = prompt;
    return this;
  }

  /**
   * @deprecated See https://github.com/jovotech/jovo-framework/tree/v3/latest/examples/typescript/02_googleassistantconv/account-linking
   */
  showAccountLinkingCard(): this {
    throw new Error('Not supported in Google Assistant Conversational Actions. ');
  }

  promptAsk(prompt: Prompt, ...reprompts: Prompt[]): this {
    this.$output.GoogleAssistant.askPrompt = {
      prompt,
      reprompts,
    };
    return this;
  }

  /**
   * @deprecated Please use addTypeOverrides(typeOverrides: TypeOverride[])
   * @param sessionEntityTypes
   */
  // tslint:disable-next-line:no-any
  addSessionEntityTypes(sessionEntityTypes: any) {
    throw new Error(
      `Not supported in Google Assistant Conversational Actions. Please use addTypeOverrides(typeOverrides: TypeOverride[])`,
    );
  }

  /**
   * @deprecated Please use addTypeOverrides(typeOverrides: TypeOverride[])
   * @param sessionEntityType
   */
  // tslint:disable-next-line:no-any
  addSessionEntityType(sessionEntityType: any) {
    return this.addSessionEntityTypes(sessionEntityType);
  }
  /**
   * @deprecated Please use addTypeOverrides(typeOverrides: TypeOverride[])
   * @param sessionEntity
   */
  // tslint:disable-next-line:no-any
  addSessionEntity(sessionEntity: any) {
    return this.addSessionEntityTypes(sessionEntity);
  }

  setExpected(expectedSpeech: string[], languageCode?: string) {
    this.$output.GoogleAssistant.expected = {
      speech: expectedSpeech,
      languageCode: languageCode || this.$request!.getLocale(),
    };
  }
}
