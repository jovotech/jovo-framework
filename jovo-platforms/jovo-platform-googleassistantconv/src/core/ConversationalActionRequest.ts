/**
 * Base class of a request from alexa
 */
import { Inputs, JovoRequest, SessionConstants, SessionData } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');
import {
  Capability,
  Context,
  Device,
  Handler,
  Home,
  Intent,
  Params,
  Scene,
  Session,
  User,
} from './Interfaces';

export interface ConversationalActionRequestJSON {
  handler?: Handler;
  intent?: Intent;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  context?: Context;
}

export class ConversationalActionRequest implements JovoRequest {
  handler?: Handler;
  intent?: Intent;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  context?: Context;

  getSessionId(): string | undefined {
    return this.session?.id;
  }

  getDeviceName() {
    return '';
  }

  getIntentName(): string | undefined {
    return this.intent?.name;
  }
  getSessionData() {
    return this.session?.params || {};
  }
  setSessionData(sessionData: SessionData): this {
    if (!this.session?.params) {
      this.session!.params = {};
    }
    // this.session?.params = sessionData as Params;
    return this;
  }
  // tslint:disable-next-line
  addSessionData(key: string, value: any): this {
    return this.addSessionAttribute(key, value);
  }

  setUserId(userId: string) {
    _set(this, 'user.userId', userId);
    return this;
  }

  toJSON(): ConversationalActionRequestJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this);
  }

  // fromJSON is used to convert an serialized version
  // of the User to an instance of the class
  static fromJSON(json: ConversationalActionRequestJSON | string): ConversationalActionRequest {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, ConversationalActionRequest.reviver);
    } else {
      // create an instance of the User class
      const request = Object.create(ConversationalActionRequest.prototype);
      // copy all the fields from the json object
      return Object.assign(request, json);
    }
  }
  // tslint:disable-next-line
  static reviver(key: string, value: any): any {
    return key === '' ? ConversationalActionRequest.fromJSON(value) : value;
  }

  // not available
  addInput(key: string, value: string): this {
    return this;
  }

  // not available
  // tslint:disable-next-line
  addSessionAttribute(key: string, value: any): this {
    return this;
  }

  getAccessToken(): string {
    return _get(this, 'user.accessToken'); // TODO: correct path?
  }

  getInputs(): Inputs {
    const inputs: Inputs = {};

    if (this.intent?.params) {
      for (const param in this.intent?.params) {
        if (this.intent?.params.hasOwnProperty(param)) {
          inputs[param] = {
            id: this.intent?.params[param].resolved as string, // TODO: temporary, object handling necessary
            value: this.intent?.params[param].original,
            key: this.intent?.params[param].resolved as string, // TODO: temporary, object handling necessary
            name: param,
          };
        }
      }
      return inputs;
    }

    return {};
  }

  getLocale(): string {
    return _get(this, 'user.locale');
  }

  // tslint:disable-next-line
  getSessionAttributes(): any {
    return undefined;
  }

  getTimestamp(): string {
    return new Date().toISOString();
  }

  getUserId(): string {
    return ''; // todo:
  }

  getUserStorage(): string {
    return _get(this, 'user.params');
  }

  hasWebBrowserInterface(): boolean {
    if (this.device) {
      return !!this.device.capabilities.find((cap: Capability) => cap === 'WEB_LINK');
    }
    return false;
  }

  hasAudioInterface(): boolean {
    if (this.device) {
      return !!this.device.capabilities.find(
        (cap: Capability) => cap === 'SPEECH' || cap === 'LONG_FORM_AUDIO',
      );
    }
    return false;
  }

  hasScreenInterface(): boolean {
    if (this.device) {
      return !!this.device.capabilities.find((cap: Capability) => cap === 'RICH_RESPONSE');
    }
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  hasLongFormAudioInterface(): boolean {
    if (this.device) {
      return !!this.device.capabilities.find((cap: Capability) => cap === 'LONG_FORM_AUDIO');
    }
    return false;
  }

  isNewSession(): boolean {
    return !_get(this, 'session.params._JOVO_SESSION_');
  }

  setAccessToken(accessToken: string): this {
    _set(this, `user.accessToken`, accessToken); // TODO:
    return this;
  }

  setAudioInterface(): this {
    // TODO:
    return this;
  }

  setLocale(locale: string): this {
    _set(this, `user.locale`, locale);
    return this;
  }

  setNewSession(isNew: boolean): this {
    // TODO:
    return this;
  }

  setScreenInterface(): this {
    return this;
  }

  // tslint:disable-next-line
  setSessionAttributes(attributes: Record<string, any>): this {
    if (_get(this, 'session.params')) {
      _set(this, `session.params`, attributes);
    }
    return this;
  }

  setState(state: string): this {
    if (_get(this, 'session.params')) {
      _set(this, `session.params[${SessionConstants.STATE}]`, state);
    }
    return this;
  }

  getState() {
    return _get(this, `session.params[${SessionConstants.STATE}]`);
  }

  setInputs(inputs: Inputs): this {
    for (const [key, value] of Object.entries(inputs)) {
      this.intent!.params![key] = {
        original: value.id || value.value,
        resolved: value.value,
      };
    }
    return this;
  }

  // GoogleActionRequest can't handle timestamps
  setTimestamp(timestamp: string): this {
    return this;
  }

  setIntentName(intentName: string): this {
    this.intent!.name = intentName;
    return this;
  }

  // GoogleActionRequest can't handle video interfaces
  setVideoInterface(): this {
    return this;
  }
}
