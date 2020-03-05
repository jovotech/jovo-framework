import { JovoResponse, SpeechBuilder, SessionConstants, SessionData } from 'jovo-core';

import { AutopilotSpeechBuilder } from './AutopilotSpeechBuilder';

/**
 * @see https://www.twilio.com/docs/autopilot/actions
 *
 * Twilio Autopilot response is an object containing an array of `actions`.
 * Each action is an object that contains one of the response's features.
 * For example the object with the `say` property is the normal text/voice output.
 * The object with the `play` property contains the audio file output, etc.
 */
export class AutopilotResponse implements JovoResponse {
  actions: any[]; // tslint:disable-line:no-any

  constructor() {
    this.actions = [];
  }

  getSpeech(): string | undefined {
    const speechAction = this.actions.find((action) => {
      return action.say;
    });

    if (!speechAction) return;

    return SpeechBuilder.removeSpeakTags(speechAction.say);
  }

  /**
   * Autopilot doesn't support reprompts
   */
  getReprompt(): undefined {
    return undefined;
  }

  getSpeechPlain(): string | undefined {
    const sayAction = this.actions.find((action) => {
      return action.say;
    });

    if (!sayAction) return;

    return SpeechBuilder.removeSSML(sayAction.say);
  }

  /**
   * Autopilot doesn't support reprompts
   */
  getRepromptPlain(): undefined {
    return undefined;
  }

  getSessionAttributes(): SessionData | undefined {
    const rememberAction = this.actions.find((action) => {
      return action.remember;
    });

    return rememberAction?.remember;
  }

  setSessionAttributes(sessionData: SessionData): this {
    const rememberAction = this.actions.find((action) => {
      return action.remember;
    });

    if (rememberAction) {
      rememberAction.remember = Object.assign(rememberAction.remember, sessionData);
    } else {
      const newRememberAction = { remember: sessionData };
      this.actions.push(newRememberAction);
    }

    return this;
  }

  // tslint:disable-next-line:no-any
  addSessionAttribute(key: string, value: any): this {
    const rememberAction = this.actions.find((action) => {
      return action.remember;
    });

    if (rememberAction) {
      rememberAction.remember[key] = value;
    } else {
      const newRememberAction = { remember: { key: value } };
      this.actions.push(newRememberAction);
    }

    return this;
  }

  getSessionAttribute(path: string) {
    const sessionAttributes = this.getSessionAttributes();
    return sessionAttributes ? sessionAttributes[path] : undefined;
  }

  getSessionData(path?: string) {
    if (path) {
      return this.getSessionAttribute(path);
    } else {
      return this.getSessionAttributes();
    }
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  isTell(speechText?: string | string[]): boolean {
    const hasListenAction = this.actions.some((action) => {
      return action.listen;
    });
    // is ask()!
    if (hasListenAction) return false;

    const sayAction = this.actions.find((action) => {
      return action.say;
    });

    // no speech output in response
    if (!sayAction) return false;

    if (Array.isArray(speechText)) {
      for (const speech of speechText) {
        if (AutopilotSpeechBuilder.toSSML(speech) === sayAction.say) return true;
      }
    }

    return AutopilotSpeechBuilder.toSSML(speechText as string) === sayAction.say;
  }

  isAsk(speechText?: string | string[]): boolean {
    const hasListenAction = this.actions.some((action) => {
      return action.listen;
    });
    // is tell()!
    if (!hasListenAction) return false;

    const sayAction = this.actions.find((action) => {
      return action.say;
    });

    // no speech output in response
    if (!sayAction) return false;

    if (Array.isArray(speechText)) {
      for (const speech of speechText) {
        if (AutopilotSpeechBuilder.toSSML(speech) === sayAction.say) return true;
      }
    }

    return AutopilotSpeechBuilder.toSSML(speechText as string) === sayAction.say;
  }

  hasState(state: string): boolean | undefined {
    return this.hasSessionData(SessionConstants.STATE, state);
  }

  // tslint:disable-next-line:no-any
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  // tslint:disable-next-line:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    if (value) {
      return this.getSessionAttribute(name) === value;
    } else {
      return this.getSessionAttribute(name) ? true : false;
    }
  }

  hasSessionEnded(): boolean {
    return this.isTell();
  }

  static fromJSON(json: string) {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json);
    } else {
      // create an instance of the User class
      const autopilotResponse = Object.create(AutopilotResponse.prototype);
      // copy all the fields from the json object
      return Object.assign(autopilotResponse, json);
    }  
  }
}
