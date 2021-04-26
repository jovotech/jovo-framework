import { JovoResponse, SpeechBuilder, SessionConstants, SessionData } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface SessionAttributes {
  [key: string]: any; //tslint:disable-line
}

export type ConfirmationStatus = 'None' | 'Confirmed' | 'Denied';
export type DialogActionType =
  | 'ElicitIntent'
  | 'ElicitSlot'
  | 'ConfirmIntent'
  | 'Delegate'
  | 'Close';
export type FulfillmentState = 'Fulfilled' | 'Failed';

export interface IntentSummaryView {
  intentName: string;
  checkpointLabel: string;
  slots: { [key: string]: any }; //tslint:disable-line
}

export interface DialogAction {
  type: DialogActionType;
  fulfillmentState: 'Fulfilled' | 'Failed';
  message: {
    contentType: 'PlainText' | 'SSML' | 'CustomPayload';
    content: string;
  };
}

export class LexResponse implements JovoResponse {
  sessionAttributes?: {
    jsonData: string;
  };
  recentIntentSummaryView?: IntentSummaryView;
  confirmationStatus?: ConfirmationStatus;
  dialogActionType?: DialogActionType;
  fulfillmentState?: FulfillmentState;
  slotToElicit?: string;
  dialogAction?: DialogAction;

  constructor() {}

  getSpeech(): string | undefined {
    const speechAction = this.dialogAction?.message;
    if (!speechAction) return;
    return SpeechBuilder.removeSpeakTags(speechAction.content);
  }

  /**
   * Lex doesn't support reprompts
   */
  getReprompt(): undefined {
    return undefined;
  }

  getSpeechPlain(): string | undefined {
    const sayAction = this.dialogAction?.message;
    if (!sayAction) return;
    return SpeechBuilder.removeSSML(sayAction.content);
  }

  /**
   * Lex doesn't support reprompts
   */
  getRepromptPlain(): undefined {
    return undefined;
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
    return JSON.parse(_get(this, 'sessionAttributes.jsonData', '{}'));
  }

  setSessionAttributes(sessionData: SessionData) {
    _set(this, 'sessionAttributes.jsonData', JSON.stringify(sessionData));
    return this;
  }

  /**
   *
   * @param {string} name
   * @param {any} value
   * @return {boolean}
   */
  // tslint:disable-next-line
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

  getSessionAttribute(name: string) {
    return _get(this.getSessionAttributes(), name);
  }

  /**
   * Checks if response is a tell request
   * @param {string| string[]} speechText
   * @return {boolean}
   */
  isTell(speechText?: string | string[]): boolean {
    if (_get(this, 'dialogAction.type') === 'Close') {
      return true;
    }
    return false;
  }

  isAsk(speechText?: string | string[]): boolean {
    if (_get(this, 'dialogAction.type') !== 'Close') {
      return true;
    }
    return false;
  }

  hasState(state: string): boolean | undefined {
    return this.hasSessionData(SessionConstants.STATE, state);
  }

  /**
   * Returns true if there is no Listen, Collect, or Redirect action
   */
  hasSessionEnded(): boolean {
    return !this.isAsk();
  }

  static fromJSON(json: string) {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json);
    } else {
      // create an instance of the User class
      const lexResponse = Object.create(LexResponse.prototype);
      // copy all the fields from the json object
      return Object.assign(lexResponse, json);
    }
  }
}
