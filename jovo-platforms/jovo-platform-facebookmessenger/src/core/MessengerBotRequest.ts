import { Inputs, JovoRequest, SessionData } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { MessagingData, MessengerBotEntry } from '../Interfaces';

export type MessengerBotRequestJSON = Partial<MessengerBotEntry>;

export class MessengerBotRequest implements JovoRequest {
  static fromJSON(json: MessengerBotRequestJSON | string): MessengerBotRequest {
    if (typeof json === 'string') {
      return JSON.parse(json, MessengerBotRequest.reviver);
    } else {
      const request = Object.create(MessengerBotRequest.prototype);
      // tslint:disable-next-line
      return Object.assign(request, json);
    }
  }

  static reviver(key: string, value: any): any {
    return key === '' ? MessengerBotRequest.fromJSON(value) : value;
  }
  id?: string;
  time?: number;
  messaging?: [MessagingData];
  nlu?: {
    intentName: string;
  };
  inputs?: Inputs;
  locale?: string;

  addInput(key: string, value: string): this {
    if (!this.inputs) {
      this.inputs = {};
    }
    this.inputs[key] = {
      name: key,
      value,
    };
    return this;
  }

  addSessionAttribute(key: string, value: any): this {
    return this;
  }

  addSessionData(key: string, value: any): this {
    return this;
  }

  getAccessToken(): string | undefined {
    return undefined;
  }

  getDeviceName(): string | undefined {
    return undefined;
  }

  getInputs(): Inputs {
    return this.inputs || {};
  }

  getIntentName(): string | undefined {
    return _get(this, 'nlu.intentName');
  }

  getLocale(): string {
    return this.locale || 'en-US';
  }

  getSessionAttributes(): SessionData {
    return {};
  }

  getSessionData(): SessionData {
    return {};
  }

  getSessionId(): string | undefined {
    return undefined;
  }

  getState(): string | undefined {
    return undefined;
  }

  getTimestamp(): string {
    return _get(this, `messaging[0].timestamp`, '');
  }

  getUserId(): string {
    return _get(this, `messaging[0].sender.id`, '');
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
    return false;
  }

  setAccessToken(accessToken: string): this {
    return this;
  }

  setAudioInterface(): this {
    return this;
  }

  setInputs(inputs: Inputs): this {
    this.inputs = inputs;
    return this;
  }

  setIntentName(intentName: string): this {
    this.nlu = {
      intentName,
    };
    return this;
  }

  setLocale(locale: string): this {
    this.locale = locale;
    return this;
  }

  setNewSession(isNew: boolean): this {
    return this;
  }

  setScreenInterface(): this {
    return this;
  }

  setSessionAttributes(attributes: SessionData): this {
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this;
  }

  setState(state: string): this {
    return this;
  }

  setTimestamp(timestamp: string): this {
    _set(this, `messaging[0].timestamp`, timestamp);
    return this;
  }

  setUserId(userId: string): this {
    _set(this, `messaging[0].sender.id`, userId);
    return this;
  }

  setVideoInterface(): this {
    return this;
  }

  toJSON(): any {
    return Object.assign({}, this);
  }
}
