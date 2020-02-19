import _get = require('lodash.get');
import { JovoResponse, SessionConstants, SessionData, SpeechBuilder } from 'jovo-core';
import { SessionEntityType } from './Interfaces';

export interface Payload {
  [key: string]: JovoResponse;
}
interface Context {
  name: string;
  lifespanCount?: number;
  parameters?: { [key: string]: any }; // tslint:disable-line
}

export interface DialogflowResponseJSON {
  fulfillmentText?: string;
  outputContexts?: Context[];
  payload?: Payload;
}

/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */

export class DialogflowResponse implements JovoResponse {
  fulfillmentText?: string;
  payload?: Payload;
  outputContexts?: Context[];
  sessionEntityTypes?: SessionEntityType[];

  getContext(name: string) {
    return this.outputContexts?.find((context: Context) => {
      return context.name.indexOf(`/contexts/_jovo_${name}_`) > -1;
    });
  }

  hasContext(name: string) {
    return this.getContext(name) ? true : false;
  }

  getPlatformId() {
    if (this.payload) {
      const keys = Object.keys(this.payload);
      if (keys.length > 0) {
        return keys[0];
      }
    }
  }

  getSessionData(path?: string) {
    if (path) {
      return this.getSessionAttribute(path);
    } else {
      return this.getSessionAttributes();
    }
  }
  // tslint:disable-next-line
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  setSessionData(sessionData: SessionData) {
    return this.setSessionAttributes(sessionData);
  }

  getSessionAttributes() {
    if (this.outputContexts) {
      const sessionContext = this.getContext('session');

      if (sessionContext) {
        return sessionContext.parameters;
      }
    }

    return {};
  }

  getSessionAttribute(path: string) {
    const sessionData = this.getSessionAttributes();
    return _get(sessionData, path);
  }

  // TODO:
  setSessionAttributes(sessionData: SessionData) {
    return this;
  }

  hasSessionEnded() {
    const platformId = this.getPlatformId();
    if (this.payload && platformId) {
      if (typeof _get(this.payload, `${platformId}.hasSessionEnded`) === 'function') {
        return this.payload[platformId].hasSessionEnded();
      }
    }

    return !this.hasContext('ask');
  }

  getSpeech() {
    const platformId = this.getPlatformId();
    if (this.payload && platformId) {
      if (typeof _get(this.payload, `${platformId}.getSpeech`) === 'function') {
        const speech = this.payload[platformId].getSpeech();
        if (!speech) {
          return;
        }
        return SpeechBuilder.removeSpeakTags(speech);
      }
    }
    return this.fulfillmentText ? SpeechBuilder.removeSpeakTags(this.fulfillmentText) : '';
  }

  getReprompt() {
    const platformId = this.getPlatformId();
    if (this.payload && platformId) {
      if (typeof _get(this.payload, `${platformId}.getReprompt`) === 'function') {
        const reprompt = this.payload[platformId].getReprompt();
        if (!reprompt) {
          return;
        }
        return SpeechBuilder.removeSpeakTags(reprompt);
      }
    }
    return undefined;
  }

  getSpeechPlain() {
    const speech = this.getSpeech();
    if (!speech) {
      return;
    }

    return SpeechBuilder.removeSSML(speech);
  }
  getRepromptPlain() {
    const reprompt = this.getReprompt();
    if (!reprompt) {
      return;
    }

    return SpeechBuilder.removeSSML(reprompt);
  }

  isTell(speech?: string | string[]) {
    const platformId = this.getPlatformId();
    if (this.payload && platformId) {
      if (typeof _get(this.payload, `${platformId}.isTell`) === 'function') {
        return this.payload[platformId].isTell(speech);
      }
    }
    return !this.hasContext('ask');
  }

  isAsk(speech?: string | string[], reprompt?: string | string[]) {
    const platformId = this.getPlatformId();
    if (this.payload && platformId) {
      if (typeof _get(this.payload, `${platformId}.isAsk`) === 'function') {
        return this.payload[platformId].isAsk(speech, reprompt);
      }
    }

    return this.hasContext('ask');
  }

  hasState(state: string) {
    return this.hasSessionAttribute(SessionConstants.STATE, state);
  }
  // tslint:disable-next-line
  hasSessionAttribute(name: string, value?: any) {
    if (!this.getSessionAttribute(name)) {
      return false;
    }

    if (typeof value !== 'undefined') {
      if (this.getSessionAttribute(name) !== value) {
        return false;
      }
    }

    return true;
  }

  getPlatformResponse() {
    return this.payload[this.getPlatformId()];
  }

  toJSON(): DialogflowResponseJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this);
  }

  // fromJSON is used to convert an serialized version
  // of the User to an instance of the class
  static fromJSON(json: DialogflowResponseJSON | string) {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, DialogflowResponse.reviver);
    } else {
      // create an instance of the User class
      const response = Object.create(DialogflowResponse.prototype);
      // copy all the fields from the json object
      return Object.assign(response, json);
    }
  }

  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.
  // tslint:disable-next-line
  static reviver(key: string, value: any): any {
    return key === '' ? DialogflowResponse.fromJSON(value) : value;
  }
}
