import {JovoRequest, SessionData, SessionConstants, Inputs, Input} from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface LexInputs extends Inputs {
  [key: string]: LexInput;
}

export interface LexInput extends Input {
  type?: string;
}

export interface SessionAttributes {
  [key: string]: any; //tslint:disable-line
}

export interface LexBot {
  name?: string;
  alias?: string;
  version: string;
}

export interface LexIntent {
  name?: string;
  slots?: LexInput;
  nluIntentConfidenceScore: number;
}

export interface LexRequestJSON {
  // https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html
  invocationSource?: string; //
  userId?: string; // user id (for Voice and SMS it will be user's phone number)
  bot?: LexBot;
  currentIntent?: LexIntent;
  //alternativeIntents: [LexIntent];
  inputTranscript?: string;
  sessionAttributes: SessionAttributes;  // tslint:disable-next-line:no-any
  //  sessionData: SessionData = {};  // tslint:disable-next-line:no-any

  // tslint:disable-next-line:no-any
  [key: string]: any; // used for fields (inputs). can only be strings!
}

export class LexRequest implements JovoRequest {
  // https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html
  // original request uses upper case properties.
  /* tslint:disable:variable-name */
  invocationSource?: string; //
  userId?: string; // user id (for Voice and SMS it will be user's phone number)
  bot?: LexBot;
  currentIntent?: LexIntent;
  //alternativeIntents: [LexIntent];
  inputTranscript?: string;
  sessionAttributes: SessionAttributes = {};  // tslint:disable-next-line:no-any
  // tslint:disable-next-line:no-any
  [key: string]: any; // used for fields (inputs). can only be strings!

  /* tslint:enable:variable-name */

  getUserId(): string {
    return this.userId!;
  }

  getRawText(): string {
    return '';
  }

  getTimestamp(): string {
    return new Date().toISOString();
  }

  getDeviceName(): string | undefined {
    return undefined;
  }

  getAccessToken(): string | undefined {
    return undefined;
  }

  // platform only supports `en-US` as of 17.11.2019
  getLocale(): string {
    return 'en-US';
  }

  isNewSession(): boolean {
    return false;
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

  getSessionData() {
    return this.getSessionAttributes();
  }

  getState() {
    return _get(this.getSessionAttributes(), SessionConstants.STATE);
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  // tslint:disable-next-line
  addSessionData(key: string, value: any): this {
    return this.addSessionAttribute(key, value);
  }

  getSessionAttributes() {
    return _get(this, 'sessionAttributes');
  }

  setSessionAttributes(attributes: SessionData): this {
    if ( this.getSessionAttributes() ) {
      _set(this, 'sessionAttributes', attributes);
    }
    return this;
  }

  // tslint:disable-next-line
  addSessionAttribute(key: string, value: any) {
    if ( this.getSessionAttributes() ) {
      _set(this, `sessionAttributes.${key}`, value);
    }
    return this;
  }

  setState(state: string) {
    if ( _get(this, 'sessionAttributes') ) {
      _set(this, `sessionAttributes[${SessionConstants.STATE}]`, state);
    }
    return this;
  }

  setTimestamp(timestamp: string): this {
    return this;
  }

  setLocale(locale: string): this {
    return this;
  }

  setUserId(userId: string): this {
    this.UserIdentifier = userId;
    return this;
  }

  setAccessToken(accessToken: string): this {
    return this;
  }

  setNewSession(isNew: boolean): this {
    return this;
  }

  setAudioInterface(): this {
    return this;
  }

  setScreenInterface(): this {
    return this;
  }

  setVideoInterface(): this {
    return this;
  }

  getIntentName(): string {
    return _get(this, 'currentIntent.name');
  }

  getCurrentTaskConfidence(): string {
    return this.CurrentTaskConfidence!;
  }

  getNextBestTask(): string {
    return this.NextBestTask!;
  }

  setIntentName(intentName: string): this {
    this.CurrentTask = intentName;
    return this;
  }

  setSessionId(id: string): this {
    this.DialogueSid = id;
    return this;
  }

  setNextBestTask(task: string): this {
    this.NextBestTask = task;
    return this;
  }

  setCurrentTaskConfidence(confidence: string): this {
    this.CurrentTaskConfidence = confidence;
    return this;
  }
  getSlots() {
    return _get(this, 'currentIntent.slots');
  }
  getInputs() {
    const inputs = {};
    const slots = this.getSlots();
    if ( !slots ) {
      return inputs;
    }
    Object.keys(slots).forEach((slot: string) => {
      if(slots[slot]===null || slots[slot]===undefined ){
        return;
      }
      const input = {
        name: slot,
        value: _get(this, 'currentIntent.slotDetails.'+slot+'.originalValue'),
        id: slots[slot]
      };
      // @ts-ignore
      inputs[slot] = input;
    });
    return inputs;
  }

  addInput(key: string, value: string | LexInput): this {
    if ( typeof value === 'string' ) {
      this[`Field_${key}_Value`] = value;
    } else {
      this[`Field_${key}_Type`] = value.type;
      this[`Field_${key}_Value`] = value.value;
    }

    return this;
  }

  setInputs(inputs: LexInputs): this {
    Object.entries(inputs).forEach(([name, input]) => {
      this.addInput(name, input);
    });

    return this;
  }

  getSessionId(): string | undefined {
    return;
  }

  toJSON(): LexRequestJSON {
    return Object.assign({}, this);
  }

  static fromJSON(json: object | string): LexRequest {
    if ( typeof json === 'string' ) {
      json = decodeURIComponent(json);
      return JSON.parse(json);
    } else {
      const request: LexRequest = Object.create(LexRequest.prototype);
      Object.assign(request, json);
      Object.entries(request).forEach(([key, value]) => {
        //decodeURIComponent
        request[key] = (value);
      });
      return request;
    }
  }

  // TODO: add lex specific get/set methods
}
