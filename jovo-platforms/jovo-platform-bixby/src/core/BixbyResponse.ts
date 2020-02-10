import { JovoResponse } from 'jovo-core';
import _get from 'lodash.get';
import { Response, SessionData } from './Interfaces';

export class BixbyResponse implements JovoResponse {
  _JOVO_SESSION_DATA_?: SessionData;
  _JOVO_SPEECH_?: string;
  _JOVO_AUDIO_?: string;
  // tslint:disable:no-any
  _JOVO_LAYOUT_?: { [key: string]: any };

  static fromJSON(jsonRaw: Response | string) {
    const json = typeof jsonRaw === 'string' ? JSON.parse(jsonRaw) : jsonRaw;
    const response = Object.create(BixbyResponse.prototype);
    return Object.assign(response, json);
  }

  setSessionId(id: string) {
    if (!this._JOVO_SESSION_DATA_) {
      this._JOVO_SESSION_DATA_ = {
        _JOVO_SESSION_ID_: '',
      };
    }
    this._JOVO_SESSION_DATA_._JOVO_SESSION_ID_ = id;
    return this;
  }

  getSessionId(): string | undefined {
    if (this._JOVO_SESSION_DATA_) {
      return this._JOVO_SESSION_DATA_._JOVO_SESSION_ID_;
    }
  }

  getSpeech(): string | undefined {
    return this._JOVO_SPEECH_;
  }

  getReprompt(): string | undefined {
    // TODO: implement reprompt
    return this._JOVO_SPEECH_;
  }

  getSpeechPlain(): string | undefined {
    throw new Error('Method not implemented.');
  }

  getRepromptPlain(): string | undefined {
    throw new Error('Method not implemented.');
  }

  getSessionAttributes(): SessionData | undefined {
    return this._JOVO_SESSION_DATA_;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    this._JOVO_SESSION_DATA_ = sessionAttributes;
    return this;
  }

  getSessionData(): SessionData | undefined {
    return this.getSessionAttributes();
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  isTell(speechText?: string | string[] | undefined): boolean {
    throw new Error('Method not implemented.');
  }

  isAsk(
    speechText?: string | string[] | undefined,
    repromptText?: string | string[] | undefined,
  ): boolean {
    throw new Error('Method not implemented.');
  }

  hasState(state: string): boolean | undefined {
    return state === _get(this._JOVO_SESSION_DATA_, '_JOVO_STATE_');
  }

  getSessionAttribute(key: string): string | undefined {
    return this._JOVO_SESSION_DATA_![key];
  }

  // tslint:disable:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    const sessionAttribute = this.getSessionAttribute(name);
    if (value && sessionAttribute === value) {
      return true;
    }
    return false;
  }

  // tslint:disable:no-any
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  hasSessionEnded(): boolean {
    // TODO implement
    return true;
  }
}
