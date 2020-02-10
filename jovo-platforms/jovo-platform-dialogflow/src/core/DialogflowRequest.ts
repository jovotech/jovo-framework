import _get = require('lodash.get');
import _set = require('lodash.set');
import _mapValues = require('lodash.mapvalues');

import { JovoRequest, SessionConstants, Inputs, SessionData, Input } from 'jovo-core';

interface Intent {
  name: string;
  displayName: string;
  isFallback: boolean;
}

interface QueryResult {
  queryText: string;
  parameters: any; // tslint:disable-line
  allRequiredParamsPresent: boolean;
  intent: Intent;
  intentDetectionConfidence: number;
  languageCode: string;
  outputContexts?: Context[];
}

export interface OriginalDetectIntentRequest<T extends JovoRequest = JovoRequest> {
  source: string;
  version: string;
  payload: T;
}

export interface DialogflowRequestJSON {
  responseId?: string;
  queryResult?: QueryResult;
  originalDetectIntentRequest?: OriginalDetectIntentRequest;
  session?: string;
}
export interface Context {
  name: string;
  lifespanCount?: number;
  parameters?: { [key: string]: any }; // tslint:disable-line
}

export class DialogflowRequest<T extends JovoRequest = JovoRequest> implements JovoRequest {
  responseId?: string;
  queryResult?: QueryResult;
  originalDetectIntentRequest?: OriginalDetectIntentRequest;
  session?: string;

  constructor(originalRequest: T) {
    this.originalDetectIntentRequest.payload = originalRequest;
  }

  getDeviceName(): string {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.getDeviceName') === 'function') {
      return this.originalDetectIntentRequest.payload.getDeviceName();
    }
    return;
  }

  getSessionId(): string | undefined {
    return this.session;
  }

  getSessionData() {
    return this.getSessionAttributes();
  }
  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }
  // tslint:disable-next-line
  addSessionData(key: string, value: any): this {
    return this.addSessionAttribute(key, value);
  }

  getAccessToken() {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.getAccessToken') === 'function') {
      return this.originalDetectIntentRequest.payload.getAccessToken();
    }
    return 'DIALOGFLOW-DEFAULT-ACCESS-TOKEN';
  }
  getLocale() {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.getLocale') === 'function') {
      return this.originalDetectIntentRequest.payload.getLocale();
    }
    return this.queryResult.languageCode;
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  getUserId() {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.getUserId') === 'function') {
      return this.originalDetectIntentRequest.payload.getUserId();
    }
    return 'DIALOGFLOW-DEFAULT-USER-ID';
  }

  isNewSession() {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.isNewSession') === 'function') {
      return this.originalDetectIntentRequest.payload.isNewSession();
    }
    const askContext: Context | undefined = this.getAskContext();
    return typeof askContext === 'undefined';
  }

  getIntentName() {
    return this.queryResult.intent.displayName;
  }

  setUserId(userId: string) {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setUserId') === 'function') {
      this.originalDetectIntentRequest.payload.setUserId(userId);
    }
    return this;
  }

  /**
   * Returns session context of request
   */
  getSessionContext(): Context | undefined {
    const sessionId = this.session;

    if (this.queryResult && this.queryResult.outputContexts) {
      return this.queryResult.outputContexts.find((context: Context) => {
        return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
      });
    }
  }

  /**
   * Returns ask context of request
   */
  getAskContext(): Context | undefined {
    const sessionId = this.session;

    if (this.queryResult && this.queryResult.outputContexts) {
      return this.queryResult.outputContexts.find((context: Context) => {
        return context.name.startsWith(`${sessionId}/contexts/_jovo_ask_`);
      });
    }
  }

  toJSON(): DialogflowRequestJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this);
  }

  // fromJSON is used to convert an serialized version
  // of the User to an instance of the class
  static fromJSON(json: DialogflowRequestJSON | string): DialogflowRequest {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, DialogflowRequest.reviver);
    } else {
      // create an instance of the User class
      const request = Object.create(DialogflowRequest.prototype);
      // copy all the fields from the json object
      return Object.assign(request, json);
    }
  }

  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.
  // tslint:disable-next-line
  static reviver(key: string, value: any): any {
    return key === '' ? DialogflowRequest.fromJSON(value) : value;
  }

  addInput(key: string, value: string): this {
    this.queryResult.parameters[key] = value;
    return this;
  }

  setIntentName(intentName: string) {
    this.queryResult.intent.displayName = intentName;
    return this;
  }

  // tslint:disable-next-line
  addSessionAttribute(key: string, value: any): this {
    const sessionId = _get(this, 'session');
    const sessionContext: Context = _get(this, 'queryResult.outputContexts', []).find(
      (context: Context) => {
        return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
      },
    );

    if (sessionContext) {
      sessionContext.lifespanCount = 1;
      sessionContext.parameters[key] = value;
    } else {
      this.queryResult.outputContexts.push({
        lifespanCount: 1,
        name: `${sessionId}/contexts/_jovo_session_`,
        parameters: {
          [key]: value,
        },
      });
    }
    return this;
  }

  getInputs(): Inputs {
    // tslint:disable-line
    const params = _get(this, 'queryResult.parameters');

    const inputs = _mapValues(params, (value: string, name: string) => {
      return {
        name,
        value,
        key: value, // Added for cross platform consistency
        id: value, // Added for cross platform consistency
      };
    });

    if (this.queryResult.outputContexts && this.queryResult.outputContexts.length > 0) {
      const parameters = this.queryResult.outputContexts[0].parameters;
      for (const key in parameters) {
        if (inputs[key]) {
          const originalKey = key + '.original';
          inputs[key] = {
            name: parameters[key],
            value: parameters[originalKey],
            key: parameters[key],
            id: parameters[key],
          };
        }
      }
    }
    return inputs;
  }

  setInputs(inputs: Inputs): this {
    Object.keys(inputs).forEach((key: string) => {
      const input: Input = inputs[key];
      this.setParameter(key, input.value);
    });
    return this;
  }

  getState() {
    return _get(this.getSessionAttributes(), SessionConstants.STATE);
  }

  getSessionAttributes(): SessionData {
    // tslint:disable-line

    const sessionId = _get(this, 'session');
    let sessionAttributes: any = {}; // tslint:disable-line
    const sessionContext = _get(this, 'queryResult.outputContexts', []).find((context: Context) => {
      return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
    });

    if (sessionContext) {
      sessionAttributes = sessionContext.parameters;

      for (const parameter of Object.keys(_get(this, 'queryResult.parameters'))) {
        delete sessionAttributes[parameter];
        delete sessionAttributes[parameter + '.original'];
      }
    }
    return sessionAttributes;
  }

  setSessionAttributes(attributes: SessionData): this {
    // tslint:disable-line
    const sessionId = _get(this, 'session');
    const sessionContext: Context = _get(this, 'queryResult.outputContexts', []).find(
      (context: Context) => {
        return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
      },
    );

    if (sessionContext) {
      sessionContext.lifespanCount = 1;
      sessionContext.parameters = attributes;
    } else {
      this.queryResult.outputContexts.push({
        lifespanCount: 1,
        name: `${sessionId}/contexts/_jovo_session_${Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5)}`,
        parameters: attributes,
      });
    }
    return this;
  }

  hasAudioInterface(): boolean {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.hasAudioInterface') === 'function') {
      return this.originalDetectIntentRequest.payload.hasAudioInterface();
    }
    return true;
  }

  hasScreenInterface(): boolean {
    if (
      typeof _get(this.originalDetectIntentRequest, 'payload.hasScreenInterface') === 'function'
    ) {
      return this.originalDetectIntentRequest.payload.hasScreenInterface();
    }
    return true;
  }

  hasVideoInterface(): boolean {
    if (
      typeof _get(this.originalDetectIntentRequest, 'payload.hasScreenInterface') === 'function'
    ) {
      return this.originalDetectIntentRequest.payload.hasVideoInterface();
    }
    return false;
  }

  setAccessToken(accessToken: string): this {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setAccessToken') === 'function') {
      this.originalDetectIntentRequest.payload.setAccessToken(accessToken);
    }
    return this;
  }

  setAudioInterface(): this {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setAudioInterface') === 'function') {
      this.originalDetectIntentRequest.payload.setAudioInterface();
    }
    return this;
  }

  setLocale(locale: string): this {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setLocale') === 'function') {
      this.originalDetectIntentRequest.payload.setLocale(locale);
    }
    _set(this, 'queryResult.languageCode', locale);
    return this;
  }

  setNewSession(isNew: boolean): this {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setNewSession') === 'function') {
      this.originalDetectIntentRequest.payload.setNewSession(isNew);
    }
    return this;
  }

  setScreenInterface(): this {
    if (
      typeof _get(this.originalDetectIntentRequest, 'payload.setScreenInterface') === 'function'
    ) {
      this.originalDetectIntentRequest.payload.setScreenInterface();
    }
    return this;
  }
  setVideoInterface(): this {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setVideoInterface') === 'function') {
      this.originalDetectIntentRequest.payload.setVideoInterface();
    }
    return this;
  }

  setState(state: string): this {
    const sessionId = _get(this, 'session');
    const sessionContext: Context = _get(this, 'queryResult.outputContexts', []).find(
      (context: Context) => {
        return context.name.startsWith(`${sessionId}/contexts/_jovo_session_`);
      },
    );

    if (sessionContext) {
      sessionContext.lifespanCount = 1;
      sessionContext.parameters[SessionConstants.STATE] = state;
    } else {
      this.queryResult.outputContexts.push({
        lifespanCount: 1,
        name: `${sessionId}/contexts/_jovo_session_${Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5)}`,
        parameters: {
          [SessionConstants.STATE]: state,
        },
      });
    }
    return this;
  }

  setTimestamp(timestamp: string): this {
    if (typeof _get(this.originalDetectIntentRequest, 'payload.setTimestamp') === 'function') {
      this.originalDetectIntentRequest.payload.setTimestamp(timestamp);
    }
    return this;
  }

  // DialogRequest Helper
  setParameter(key: string, value: string) {
    this.queryResult.parameters[key] = value;
    return this;
  }

  getParameters() {
    return this.queryResult.parameters;
  }
}
