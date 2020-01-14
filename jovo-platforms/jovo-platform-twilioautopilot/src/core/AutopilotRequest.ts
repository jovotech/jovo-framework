import { JovoRequest, SessionData, SessionConstants, Inputs, Input } from 'jovo-core';

interface AutopilotInputs extends Inputs {
  [key: string]: AutopilotInput;
}

interface AutopilotInput extends Input {
  type?: string;
}

export interface AutopilotRequestJSON {
  // https://www.twilio.com/docs/autopilot/actions/autopilot-request
  AccountSid?: string; // twilio account id
  AssistantSid?: string; // autopilot assistant id
  DialogueSid?: string; // session id
  UserIdentifier?: string; // user id (for Voice and SMS it will be user's phone number)
  CurrentInput?: string; // user's raw text
  CurrentTask?: string; // intent name
  DialoguePayloadUrl?: string; // URL to JSON payload that contains the context and data collected during the Autopilot session.
  Memory?: {
    [key: string]: any; // tslint:disable-line
  };
  Channel?: string; // channel the interaction is taking place at. e.g. SMS
  CurrentTaskConfidence?: string;
  NextBestTask?: string;
  // tslint:disable-next-line:no-any
  [key: string]: any; // used for fields (inputs). can only be strings!
}

export class AutopilotRequest implements JovoRequest {
  // https://www.twilio.com/docs/autopilot/actions/autopilot-request

  // original request uses upper case properties.
  /* tslint:disable:variable-name */
  AccountSid?: string; // twilio account id
  AssistantSid?: string; // autopilot assistant id
  DialogueSid?: string; // session id
  UserIdentifier?: string; // user id (for Voice and SMS it will be user's phone number)
  CurrentInput?: string; // user's raw text
  CurrentTask?: string; // intent name
  DialoguePayloadUrl?: string; // URL to JSON payload that contains the context and data collected during the Autopilot session.
  Memory?: {
    [key: string]: any; // tslint:disable-line
  };
  Channel?: string; // channel the interaction is taking place at. e.g. SMS
  CurrentTaskConfidence?: string;
  NextBestTask?: string;
  // tslint:disable-next-line:no-any
  [key: string]: any; // used for fields (inputs). can only be strings!
  /* tslint:enable:variable-name */

  getUserId(): string {
    return this.UserIdentifier || '';
  }

  getRawText(): string {
    return this.CurrentInput!;
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
    // TODO: maybe we could determine that using the `Channel` property
    return false;
  }

  hasScreenInterface(): boolean {
    // TODO: same as audio interface
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  getSessionAttributes(): SessionData {
    return this.getSessionData();
  }

  addSessionAttribute(key: string, value: any): this {
    // tslint:disable-line:no-any
    // tslint:disable-line
    return this.addSessionData(key, value);
  }

  getSessionData(): SessionData {
    return this.Memory || {};
  }

  addSessionData(key: string, value: any): this {
    // tslint:disable-line:no-any
    // tslint:disable-line
    if (!this.Memory) {
      this.Memory = {};
    }
    this.Memory[key] = value;
    return this;
  }

  setTimestamp(timestamp: string): this {
    return this;
  }

  setLocale(locale: string): this {
    return this;
  }

  setUserId(userId: string): this {
    this.userIdentifier = userId;
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

  setSessionAttributes(attributes: SessionData): this {
    return this.setSessionData(attributes);
  }

  setSessionData(sessionData: SessionData): this {
    this.Memory = sessionData;
    return this;
  }

  setState(state: string): this {
    if (!this.Memory) {
      this.Memory = {};
    }
    this.Memory[SessionConstants.STATE] = state;
    return this;
  }

  getIntentName(): string {
    return this.CurrentTask || '';
  }

  setIntentName(intentName: string): this {
    this.currentTask = intentName;
    return this;
  }

  getInputs(): AutopilotInputs {
    const inputs: AutopilotInputs = {};
    /**
     * Autopilot includes all the fields (inputs) on the root level of the request.
     * Each field has two key-value pairs on root:
     * Field_{field-name}_Value: string; &
     * Field_{field-name}_Type: string;
     * We extract these two values for each of the fields and save them inside the inputs object
     */
    Object.keys(this).forEach((key) => {
      if (key.includes('Field')) {
        const fieldName = getFieldNameFromKey(key);
        if (inputs[fieldName]) {
          // field was already parsed
          return;
        }

        const field: AutopilotInput = {
          name: fieldName,
          type: this[`Field_${fieldName}_Type`],
          value: this[`Field_${fieldName}_Value`],
        };
        inputs[fieldName] = field;
      }
    });

    return inputs;
  }

  addInput(key: string, value: string | object): this {
    if (!this.fields) {
      this.fields = {};
    }
    if (typeof value === 'string') {
      this.fields[key] = {
        name: key,
        value,
      };
    } else {
      this.fields[key] = value;
    }
    return this;
  }

  getState(): string | undefined {
    if (this.Memory) {
      return this.Memory[SessionConstants.STATE];
    } else {
      return undefined;
    }
  }

  setInputs(inputs: AutopilotInputs): this {
    this.fields = inputs;
    return this;
  }

  getSessionId(): string | undefined {
    return this.DialogueSid;
  }

  toJSON(): AutopilotRequestJSON {
    return Object.assign({}, this);
  }

  // TODO: why does it work like that?
  static fromJSON(json: AutopilotRequestJSON | string): AutopilotRequest {
    if (typeof json === 'string') {
      return JSON.parse(json);
    } else {
      const request = Object.create(AutopilotRequest.prototype);
      return Object.assign(request, json);
    }
  }

  // TODO: add autopilot specific get/set methods
}

/**
 * Returns field name from key,
 * e.g. returns `field-name` from `Field_{field-name}_Value`
 * @param {string} key
 * @returns {string}
 */
function getFieldNameFromKey(key: string): string {
  const firstUnderscoreIndex = key.indexOf('_');
  const lastUnderscoreIndex = key.lastIndexOf('_');

  return key.slice(firstUnderscoreIndex, lastUnderscoreIndex);
}
