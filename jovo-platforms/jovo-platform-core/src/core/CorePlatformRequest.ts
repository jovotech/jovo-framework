import { Inputs, JovoRequest, SessionConstants, SessionData } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { Context, CorePlatformRequestJSON, Request } from '../Interfaces';

export class CorePlatformRequest implements JovoRequest, CorePlatformRequestJSON {
  static fromJSON(json: CorePlatformRequestJSON | object | string): CorePlatformRequest {
    if (typeof json === 'string') {
      return JSON.parse(json, CorePlatformRequest.reviver);
    } else {
      const corePlatformRequest = Object.create(CorePlatformRequest.prototype);
      return Object.assign(corePlatformRequest, json);
    }
  }

  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? CorePlatformRequest.fromJSON(value) : value;
  }

  version = '0.0.1';
  request!: Request;
  context!: Context;

  addInput(key: string, value: string | object): this {
    if (typeof value === 'string') {
      _set(this, `request.nlu.inputs.${key}`, {
        name: key,
        value,
      });
    } else {
      _set(this, `request.nlu.inputs.${key}`, value);
    }
    return this;
  }

  // tslint:disable-next-line:no-any
  addSessionAttribute(key: string, value: any): this {
    if (this.getSessionAttributes()) {
      _set(this, `context.session.data.${key}`, value);
    }
    return this;
  }

  // tslint:disable-next-line:no-any
  addSessionData(key: string, value: any): this {
    return this.addSessionAttribute(key, value);
  }

  getAccessToken(): string | undefined {
    return _get(this, `context.user.accessToken`);
  }

  getInputs(): Inputs {
    return _get(this, `request.nlu.inputs`, {});
  }

  getIntentName(): string | undefined {
    return _get(this, `request.nlu.intent`);
  }

  getLocale(): string {
    return _get(this, `request.locale`, '');
  }

  getSessionAttributes(): SessionData {
    return _get(this, 'context.session.data', {});
  }

  getSessionData(): SessionData {
    return this.getSessionAttributes();
  }

  getSessionId(): string | undefined {
    return _get(this, 'context.session.id');
  }

  getState(): string | undefined {
    return _get(this.getSessionAttributes(), SessionConstants.STATE);
  }

  // tslint:disable-next-line:no-any
  getSupportedInterfaces(): Record<string, any> {
    return _get(this, `context.device.capabilities`, []);
  }

  getTimestamp(): string {
    return _get(this, `request.timestamp`, '');
  }

  getUserId(): string {
    return _get(this, 'context.user.id', '');
  }

  hasAudioInterface(): boolean {
    return this.supportsInterface('AudioPlayer');
  }

  hasScreenInterface(): boolean {
    return this.supportsInterface('Display');
  }

  hasVideoInterface(): boolean {
    return this.supportsInterface('VideoApp');
  }

  isNewSession(): boolean {
    return _get(this, `context.session.new`, true);
  }

  hasTextInput(): boolean {
    return !!_get(this, `request.body.text`);
  }

  setAccessToken(accessToken: string): this {
    _set(this, `context.user.accessToken`, accessToken);
    return this;
  }

  setAudioInterface(): this {
    if (_get(this, 'request.supportedInterfaces')) {
      _set(this, 'request.supportedInterfaces', {
        AudioPlayer: {},
      });
    }
    return this;
  }

  setInputs(inputs: Inputs): this {
    _set(this, 'request.nlu.inputs', inputs);
    return this;
  }

  setIntentName(intentName: string): this {
    _set(this, 'request.nlu.intent', intentName);
    return this;
  }

  setLocale(locale: string): this {
    if (_get(this, `request.locale`)) {
      _set(this, 'request.locale', locale);
    }
    return this;
  }

  setNewSession(isNew: boolean): this {
    _set(this, `context.session.new`, isNew);
    return this;
  }

  setScreenInterface(): this {
    if (_get(this, 'request.supportedInterfaces')) {
      _set(this, 'request.supportedInterfaces', {
        AudioPlayer: {},
        Display: {},
        VideoApp: {},
      });
    }
    return this;
  }

  setSessionAttributes(attributes: SessionData): this {
    _set(this, `context.session.data`, attributes);
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  setState(state: string): this {
    _set(this, `context.session.data[${SessionConstants.STATE}]`, state);
    return this;
  }

  setTimestamp(timestamp: string): this {
    _set(this, 'request.timestamp', timestamp);
    return this;
  }

  setUserId(userId: string): this {
    _set(this, 'context.user.id', userId);
    return this;
  }

  setVideoInterface(): this {
    if (_get(this, 'request.supportedInterfaces')) {
      _set(this, 'request.supportedInterfaces', {
        AudioPlayer: {},
        Display: {},
        VideoApp: {},
      });
    }
    return this;
  }

  supportsInterface(identifier: string): boolean {
    return this.getSupportedInterfaces()[identifier];
  }

  // tslint:disable-next-line:no-any
  toJSON(): any {
    return { ...this };
  }

  getDeviceName(): string {
    return _get(this, `context.device.type`, '');
  }
}
