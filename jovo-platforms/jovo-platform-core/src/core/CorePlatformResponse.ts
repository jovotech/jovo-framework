import { JovoResponse, SessionConstants, SessionData, SpeechBuilder } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');

export type Data = Record<string, any>;

export interface Response {
  endSession?: boolean;
  inputText?: string;
}

export interface CorePlatformResponseJSON {
  version: string;
  response: Response;
  session?: {
    data?: Data;
  }
  user?: {
    storage?: {
      data: Data;
    }
  }
}

export class CorePlatformResponse implements JovoResponse {
  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.
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
  response: Response;
  sessionData?: Data;
  userData?: Data;

  constructor() {
    this.version = '1.0';
    this.response = {};
    this.sessionData = {};
    this.userData = {};
  }

  getReprompt(): string | undefined {
    if (!_get(this, 'response.output.reprompt.text')) {
      return;
    }
    return SpeechBuilder.removeSpeakTags(_get(this, 'response.output.reprompt.text'));
  }

  getRepromptPlain(): string | undefined {
    const reprompt = this.getReprompt();
    if (!reprompt) {
      return;
    }
    return SpeechBuilder.removeSSML(reprompt);
  }

  getSessionAttributes(): SessionData | undefined {
    return this.sessionData;
  }

  getSessionData(): SessionData | undefined {
    return this.getSessionAttributes();
  }

  getSpeech(): string | undefined {
    if (!_get(this, 'response.output.speech.text')) {
      return;
    }
    return SpeechBuilder.removeSpeakTags(_get(this, 'response.output.speech.text'));
  }

  getSpeechPlain(): string | undefined {
    const speech = this.getSpeech();
    if (!speech) {
      return;
    }
    return SpeechBuilder.removeSSML(speech);
  }

  hasSessionAttribute(name: string, value?: any): boolean {
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

  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  hasSessionEnded(): boolean {
    return _get(this, 'response.shouldEndSession');
  }

  hasState(state: string): boolean | undefined {
    return this.hasSessionAttribute(SessionConstants.STATE, state);
  }

  isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
    if (_get(this, 'response.shouldEndSession') === true) {
      return false;
    }
    if (speechText) {
      const text: string = _get(this, 'response.output.speech.text');

      if (Array.isArray(speechText)) {
        for (const speechTextElement of speechText) {
          if (speechTextElement === text) {
            return true;
          }
        }
        return false;
      } else {
        if (text !== speechText) {
          return false;
        }
      }
    }

    if (repromptText) {
      const text: string = _get(this, 'response.output.reprompt.text');

      if (Array.isArray(repromptText)) {
        for (const speechTextElement of repromptText) {
          if (speechTextElement === text) {
            return true;
          }
        }
        return false;
      } else {
        if (text !== repromptText) {
          return false;
        }
      }
    }

    if (!_get(this, 'response.output.speech') || !_get(this, 'response.output.speech.text')) {
      return false;
    }

    if (!_get(this, 'response.output.reprompt') || !_get(this, 'response.output.reprompt.text')) {
      return false;
    }
    return true;
  }

  isTell(speechText?: string | string[]): boolean {
    if (_get(this, 'response.shouldEndSession') === false) {
      return false;
    }
    if (speechText) {
      const text: string = _get(this, 'response.output.speech.text');

      if (Array.isArray(speechText)) {
        for (const speechTextElement of speechText) {
          if (speechTextElement === text) {
            return true;
          }
        }
        return false;
      } else {
        return text === speechText;
      }
    }
    return true;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    _set(this, `sessionData`, sessionAttributes);
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  getSessionAttribute(name: string) {
    return _get(this, `sessionData.${name}`);
  }
}
