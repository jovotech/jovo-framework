import { Input, Inputs, JovoRequest, Log, SessionData } from 'jovo-core';

import { BusinessMessagesBaseRequest, BusinessMessagesMessageRequest } from '../Interfaces';

export class BusinessMessagesRequest implements JovoRequest {
  static fromJSON(json: BusinessMessagesBaseRequest | string): BusinessMessagesRequest {
    if (typeof json === 'string') {
      return JSON.parse(json, BusinessMessagesRequest.reviver);
    } else {
      const corePlatformRequest = Object.create(BusinessMessagesRequest.prototype);
      return Object.assign(corePlatformRequest, json);
    }
  }

  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? BusinessMessagesRequest.fromJSON(value) : value;
  }

  // https://developers.google.com/business-communications/business-messages/reference/rest/v1/UserMessage
  agent: string;
  conversationId: string;
  customAgentId: string;
  requestId: string;
  context?: {
    entryPoint: 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS';
    placeId: string;
    userInfo: {
      displayName: string;
    };
  };
  sendTime: string; // RFC3339 UTC "Zulu" format
  // defined if text/mage request
  message?: {
    messageId: string;
    name: string;
    text: string;
    createTime: string; // RFC3339 UTC "Zulu" format
  };
  // defined suggestion request
  suggestionResponse?: {
    message: string;
    postbackData: string;
    createTime: string; // RFC3339 UTC "Zulu" format
    text: string;
    suggestionType: 'UNKNOWN' | 'ACTION' | 'REPLY';
  };

  /**
   * the `nlu` property is only used with the Jovo TestSuite. It is not part of the actual request.
   * It won't be part of any logs.
   */
  nlu?: {
    intentName?: string;
    inputs?: Inputs;
  };

  constructor() {
    this.agent = '';
    this.conversationId = '';
    this.customAgentId = '';
    this.requestId = '';
    this.sendTime = '';
  }

  toJSON(): BusinessMessagesBaseRequest {
    return Object.assign({}, this);
  }

  /**
   * Returns the agent identifier.
   */
  getAgent(): string {
    return this.agent!;
  }

  /**
   * Returns the custom agent identifier
   */
  getCustomAgentId(): string {
    return this.customAgentId!;
  }

  /**
   * Return the request ID
   */
  getRequestId(): string {
    return this.requestId!;
  }

  getRawText(): string {
    return this.message?.text || this.suggestionResponse?.text || '';
  }

  /**
   * Returns the entry point that the user clicked to initiate the conversation.
   *
   * Either `ENTRY_POINT_UNSPECIFIED`, `PLACESHEET`, or `MAPS` if it is defined in the request.
   */
  getEntryPoint(): 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS' | undefined {
    return this.context?.entryPoint;
  }

  /**
   * Returns the ID from the Google Places database for the location the user messaged.
   */
  getPlaceId(): string | undefined {
    return this.context?.placeId;
  }

  /**
   * Returns the user's display name.
   */
  getUserDisplayName(): string | undefined {
    return this.context?.userInfo.displayName;
  }

  getDeviceName(): string | undefined {
    Log.warn("Google Business Messages doesn't parse a device name in the request.");
    return;
  }

  getUserId(): string {
    Log.warn("Google Business Messages doesn't parse an user ID in the request. Please use this.$user.getId()");
    return '';
  }

  getAccessToken(): string | undefined {
    Log.warn("Google Business Messages doesn't parse an access token in the request.");
    return;
  }

  getLocale(): string {
    Log.warn("Google Business Messages doesn't parse a locale in the request.");
    return '';
  }

  isNewSession(): boolean {
    Log.warn(
      "Google Business Messages doesn't parse a flag for new sessions in the request. Please use this.isNewSession() instead.",
    );
    return false;
  }

  getTimestamp(): string {
    return this.sendTime!;
  }

  hasAudioInterface(): boolean {
    Log.warn("Google Business Messages doesn't support multiple interfaces.");
    return false;
  }

  hasScreenInterface(): boolean {
    Log.warn("Google Business Messages doesn't support multiple interfaces.");
    return false;
  }

  hasVideoInterface(): boolean {
    Log.warn("Google Business Messages doesn't support multiple interfaces.");
    return false;
  }

  getSessionAttributes(): SessionData {
    Log.warn(
      "Google Business Messages doesn't parse session data in the request. Please use this.$session",
    );
    return {};
  }

  getSessionData(): SessionData {
    return this.getSessionAttributes();
  }

  addSessionAttribute(key: string, value: any): this {
    Log.warn(
      "Google Business Messages doesn't parse session data in the request. Please use this.$session",
    );
    return this;
  }

  addSessionData(key: string, value: any): this {
    return this.addSessionAttribute(key, value);
  }

  setTimestamp(timestamp: string): this {
    this.sendTime = timestamp;
    return this;
  }

  setLocale(locale: string): this {
    Log.warn("Google Business Messages doesn't parse a locale in the request.");
    return this;
  }

  setUserId(userId: string): this {
    Log.warn("Google Business Messages doesn't parse an user ID in the request.");
    return this;
  }

  setAccessToken(accessToken: string): this {
    Log.warn("Google Business Messages doesn't parse an access token in the request.");
    return this;
  }

  setNewSession(isNew: boolean): this {
    Log.warn(
      "Google Business Messages doesn't parse a flag for new sessions in the request. Simply use a unique conversationId in your request instead.",
    );
    return this;
  }

  setAudioInterface(): this {
    Log.warn(
      "Google Business Messages doesn't parse the interfaces of the current device in the request.",
    );
    return this;
  }

  setVideoInterface(): this {
    Log.warn(
      "Google Business Messages doesn't parse the interfaces of the current device in the request.",
    );
    return this;
  }

  setScreenInterface(): this {
    Log.warn(
      "Google Business Messages doesn't parse the interfaces of the current device in the request.",
    );
    return this;
  }

  setSessionAttributes(attributes: SessionData): this {
    Log.warn(
      "Google Business Messages doesn't parse session data in the request. Please use this.$session",
    );
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  setState(state: string): this {
    Log.warn(
      "Google Business Messages doesn't parse state data in the request. Please use this.setState() instead.",
    );
    return this;
  }

  getIntentName(): string {
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      return this.nlu?.intentName || '';
    } else {
      Log.warn(
        "Google Business Messages doesn't parse an intent in the request. Please use $businessMessagesBot.$nlu.intent.name to get the intent name",
      );
      return '';
    }
  }

  setIntentName(intentName: string): this {
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      if (!this.nlu) {
        this.nlu = {};
      }
      this.nlu.intentName = intentName;
    } else {
      Log.warn(
        "Google Business Messages doesn't parse the intent in the request. Please use this.$nlu.intent.name to set the intent name.",
      );
    }
    return this;
  }

  getInputs(): Inputs {
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      return this.nlu?.inputs || {};
    } else {
      Log.warn(
        "Google Business Messages doesn't parse inputs in the request. Please use this.$inputs to get the inputs directly",
      );
      return {};
    }
  }

  addInput(key: string, value: string | Input): this {
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      if (!this.nlu) {
        this.nlu = {};
      }

      if (!this.nlu.inputs) {
        this.nlu.inputs = {};
      }

      if (typeof value === 'string') {
        this.nlu.inputs[key] = {
          name: key,
          value,
        };
      } else {
        this.nlu.inputs[key] = value;
      }
    } else {
      Log.warn(
        "Google Business Messages doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly",
      );
    }
    return this;
  }

  getState(): string | undefined {
    Log.warn(
      "Google Business Messages doesn't parse state data in the request. Please use this.setState() instead.",
    );
    return;
  }

  setInputs(inputs: Inputs): this {
    Log.warn(
      "Google Business Messages doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly",
    );
    return this;
  }

  getSessionId(): string | undefined {
    return this.conversationId;
  }
}
