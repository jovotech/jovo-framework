import { JovoRequest, Inputs, Log, SessionData, Input } from 'jovo-core';

export class LindenbaumRequest implements JovoRequest {
  static fromJSON(json: LindenbaumRequestJSON | string): LindenbaumRequest {
    if (typeof json === 'string') {
      return JSON.parse(json);
    } else {
      const request: LindenbaumRequest = Object.create(LindenbaumRequest.prototype);
      return Object.assign(request, json);
    }
  }

  /**
   * Depending on the endpoint we have 3 request schemes.
   */
  callback?: string; // in /session & /message
  confidence?: number; // in /message
  dialogId: string; // in all
  duration?: number; // in /inactivity
  language?: string; // in /session & /message
  local?: string; // in /session
  remote?: string; // in /session
  text?: string; // in /message
  timestamp: number; // in all
  type?: MessageType; // in /message
  /**
   * the `nlu` property is only used with the Jovo TestSuite. It is not part of the actual request.
   * It won't be part of any logs.
   */
  nlu?: {
    intentName?: string;
    inputs?: Inputs;
  };

  constructor() {
    // the correct values will be parsed with fromJSON()
    this.dialogId = '';
    this.timestamp = 0;
  }

  getCallbackUrl(): string | undefined {
    return this.callback;
  }

  getUserId(): string {
    return this.dialogId;
  }

  getRawText(): string {
    return this.text || '';
  }

  getTimestamp(): string {
    return new Date(this.timestamp * 1000).toISOString();
  }

  getDeviceName(): undefined {
    return undefined;
  }

  getAccessToken(): undefined {
    return undefined;
  }

  getLocale(): string {
    return this.language || '';
  }

  getSessionId(): string {
    return this.dialogId;
  }

  getMessageType(): string | undefined {
    return this.type;
  }

  getLocal(): string | undefined {
    return this.local;
  }

  getRemote(): string | undefined {
    return this.remote;
  }

  getInputs(): Inputs {
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      return this.nlu?.inputs || {};
    } else {
      Log.warn(
        "Lindenbaum doesn't parse inputs in the request. Please use this.$inputs to get the inputs directly",
      );
      return {};
    }
  }

  getSessionAttributes(): SessionData {
    Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
    return {};
  }

  getSessionData(): SessionData {
    Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
    return {};
  }

  getState(): string | undefined {
    Log.warn(
      "Lindenbaum doesn't parse session data in the request. Please use this.getState() instead.",
    );
    return undefined;
  }

  getIntentName(): string {
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      return this.nlu?.intentName || '';
    } else {
      Log.warn(
        "Lindenbaum doesn't parse an intent in the request. Please use $lindenbaumBot.$nlu.intent.name to get the intent name",
      );
      return '';
    }
  }

  isNewSession(): boolean {
    Log.warn(
      "Lindenbaum doesn't parse a flag for new sessions in the request. Please use $lindenbaumBot.isNewSession() instead.",
    );
    return false;
  }

  hasAudioInterface(): boolean {
    Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
    return true;
  }

  hasScreenInterface(): boolean {
    Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
    return false;
  }

  hasVideoInterface(): boolean {
    Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
    return false;
  }

  setTimestamp(timestamp: string): this {
    this.timestamp = Math.floor(new Date(timestamp).getTime() / 1000);
    return this;
  }

  setLocale(locale: string): this {
    this.language = locale;
    return this;
  }

  setUserId(userId: string): this {
    this.dialogId = userId;
    return this;
  }

  setAccessToken(accessToken: string): this {
    return this;
  }

  setRawText(text: string): this {
    this.text = text;
    return this;
  }

  setConfidence(confidence: number): this {
    this.confidence = confidence;
    return this;
  }

  setCallbackUrl(url: string): this {
    this.callback = url;
    return this;
  }

  setLocal(phoneNumber: string): this {
    this.local = phoneNumber;
    return this;
  }

  setRemote(phoneNumber: string): this {
    this.remote = phoneNumber;
    return this;
  }

  setAudioInterface(): this {
    Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
    return this;
  }

  setScreenInterface(): this {
    Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
    return this;
  }

  setVideoInterface(): this {
    Log.warn("Lindenbaum doesn't parse the interfaces of the current device in the request.");
    return this;
  }

  setInputs(inputs: Inputs): this {
    Log.warn(
      "Lindenbaum doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly",
    );
    return this;
  }

  setIntentName(intentName: string): this {
    // used in integration's own tests
    if (process.env.NODE_ENV === 'UNIT_TEST') {
      if (!this.nlu) {
        this.nlu = {};
      }
      this.nlu.intentName = intentName;
    } else {
      Log.warn(
        "Lindenbaum doesn't parse the intent in the request. Please use this.$nlu.intent.name to set the intent name.",
      );
    }
    return this;
  }

  setSessionAttributes(attributes: SessionData): this {
    Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
    return this;
  }

  setState(state: string): this {
    Log.warn(
      "Lindenbaum doesn't parse state data in the request. Please use this.setState() instead.",
    );
    return this;
  }

  setNewSession(isNew: boolean): this {
    Log.warn(
      "Lindenbaum doesn't parse a flag for new sessions in the request. Simply use a unique dialogId in your request instead.",
    );
    return this;
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
        "Lindenbaum doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly",
      );
    }
    return this;
  }

  // tslint:disable-next-line:no-any
  addSessionAttribute(key: string, value: any): this {
    Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
    return this;
  }

  // tslint:disable-next-line:no-any
  addSessionData(key: string, value: any): this {
    Log.warn("Lindenbaum doesn't parse session data in the request. Please use this.$session");
    return this;
  }

  // tslint:disable-next-line:no-any
  toJSON(): LindenbaumRequestJSON {
    return Object.assign({}, this);
  }
}

export interface LindenbaumSessionRequestJSON {
  callback: string; // url for CVP Core API (https://app.swaggerhub.com/apis/Lindenbaum-GmbH/CVP-Core-API/1.0.10)
  dialogId: string;
  local: string; // phone number
  remote: string; // phone number
  timestamp: number; // unix time
}

export interface LindenbaumMessageRequestJSON {
  callback: string;
  confidence: number;
  dialogId: string;
  text: string;
  timestamp: number; // unix time
  type: MessageType;
}

export interface LindenbaumTerminatedRequestJSON {
  dialogId: string;
  timestamp: number; // unix time
}

export interface LindenbaumInactivityRequestJSON {
  dialogId: string;
  timestamp: number; // unix time
  duration: number; // last activity occurred at timestamp - duration
  callback: string;
}

type MessageType = 'SPEECH' | 'DTMF';

export type LindenbaumRequestJSON =
  | LindenbaumSessionRequestJSON
  | LindenbaumMessageRequestJSON
  | LindenbaumTerminatedRequestJSON
  | LindenbaumInactivityRequestJSON;
