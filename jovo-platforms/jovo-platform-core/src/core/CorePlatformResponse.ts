import { AsrData, JovoResponse, NluData, SessionConstants, SessionData } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { Action, CorePlatformResponseJSON } from '..';

// tslint:disable-next-line:no-any
export type Data = Record<string, any>;

// TODO fully implement methods.
export class CorePlatformResponse implements JovoResponse, CorePlatformResponseJSON {
  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.
  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    // tslint:disable-line
    return key === '' ? CorePlatformResponse.fromJSON(value) : value;
  }

  // fromJSON is used to convert an serialized version
  // of the User to an instance of the class
  static fromJSON(json: CorePlatformResponseJSON | string): CorePlatformResponse {
    // if it's a string, parse it first
    if (typeof json === 'string') {
      return JSON.parse(json, CorePlatformResponse.reviver);
    } else {
      const response = Object.create(CorePlatformResponse.prototype);
      return Object.assign(response, json);
    }
  }

  version: string;
  actions: Action[];
  reprompts: Action[];
  user: {
    data: Data;
  };
  session: {
    end: boolean;
    data: Data;
  };
  context: {
    request: {
      asr?: AsrData;
      nlu?: NluData;
    };
  };

  constructor() {
    this.version = '0.0.1';
    this.actions = [];
    this.reprompts = [];
    this.user = {
      data: {},
    };
    this.session = {
      data: {},
      end: false,
    };
    this.context = {
      request: {},
    };
  }

  getReprompt(): string | undefined {
    return JSON.stringify(this.reprompts);
  }

  getRepromptPlain(): string | undefined {
    return this.getReprompt();
  }

  getSessionAttributes(): SessionData | undefined {
    return this.session.data;
  }

  getSessionData(): SessionData | undefined {
    return this.getSessionAttributes();
  }

  getSpeech(): string | undefined {
    return JSON.stringify(this.actions);
  }

  getSpeechPlain(): string | undefined {
    return this.getSpeech();
  }

  // tslint:disable-next-line:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    return typeof value === 'undefined'
      ? this.getSessionAttribute(name)
      : this.getSessionAttribute(name) === value;
  }

  // tslint:disable-next-line:no-any
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  hasSessionEnded(): boolean {
    return _get(this, 'session.end', false);
  }

  hasState(state: string): boolean | undefined {
    return this.hasSessionAttribute(SessionConstants.STATE, state);
  }

  isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
    return false;
  }

  isTell(speechText?: string | string[]): boolean {
    return false;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    _set(this, `session.data`, sessionAttributes);
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  getSessionAttribute(name: string) {
    return _get(this, `session.data.${name}`);
  }
}
