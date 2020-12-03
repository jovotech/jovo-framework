import { JovoResponse, SpeechBuilder, SessionData, SessionConstants } from 'jovo-core';
import _get = require('lodash.get');
import _isMatch = require('lodash.ismatch');

import {Card, Device, Expected, Home, Prompt, Scene, Session, User} from './Interfaces';

export interface ConversationalGoogleActionResponseJSON {
  prompt?: Prompt;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  // tslint:disable-next-line:no-any
  metadata?: any;
  expected?: Expected;
  // tslint:disable-next-line:no-any
  logging?: any;
}

/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */

export class ConversationalActionResponse implements JovoResponse {
  prompt?: Prompt;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  // tslint:disable-next-line:no-any
  metadata?: any;
  expected?: Expected;
  // tslint:disable-next-line:no-any
  logging?: any;

  getSessionData(path?: string) {
    return undefined;
  }
  // tslint:disable-next-line
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  setSessionData(sessionData: SessionData) {
    return this;
  }

  getBasicCard() {
    const items = _get(this, 'richResponse.items');

    for (let i = 0; i < items.length; i++) {
      if (items[i].basicCard) {
        return items[i].basicCard;
      }
    }
  }

  hasImageCard(title?: string, content?: string, imageUrl?: string): boolean {
    const basicCardObject = this.getBasicCard();

    if (!basicCardObject) {
      return false;
    }

    if (!basicCardObject.image) {
      return false;
    }

    if (title) {
      if (title !== basicCardObject.title) {
        return false;
      }
    }

    if (content) {
      if (content !== basicCardObject.formattedText) {
        return false;
      }
    }

    if (imageUrl) {
      if (imageUrl !== basicCardObject.image.url) {
        return false;
      }
    }

    return true;
  }

  hasSimpleCard(title?: string, content?: string): boolean {
    const basicCardObject = this.getBasicCard();

    if (!basicCardObject) {
      return false;
    }

    if (basicCardObject.image) {
      return false;
    }

    if (title) {
      if (title !== basicCardObject.title) {
        return false;
      }
    }

    if (content) {
      if (content !== basicCardObject.formattedText) {
        return false;
      }
    }

    return true;
  }

  getSpeech() {
    if (!_get(this, 'richResponse.items[0].simpleResponse.ssml')) {
      return;
    }
    return SpeechBuilder.removeSpeakTags(_get(this, 'richResponse.items[0].simpleResponse.ssml'));
  }

  getReprompt() {
    if (!_get(this, 'noInputPrompts[0].ssml')) {
      return;
    }
    return SpeechBuilder.removeSpeakTags(_get(this, 'noInputPrompts[0].ssml'));
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

  // tslint:disable-next-line:no-any
  getSessionAttributes(): any {
    const attributes = Object.assign({ ...this.session?.params });
    delete attributes._JOVO_SESSION_;
    return attributes;
  }

  // tslint:disable-next-line:no-any
  getSessionAttribute(name: string): any {
    return this.getSessionAttributes()[name];
  }

  setSessionAttributes() {
    return this;
  }

  // tslint:disable-next-line:no-any
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

  hasState(): boolean {
    return this.hasSessionAttribute(SessionConstants.STATE);
  }

  hasSessionEnded() {
    return false;
  }

  isTell(speech?: string | string[]) {
    if (this.scene?.next.name !== 'actions.scene.END_CONVERSATION') {
      return false;
    }
    if (speech) {
      const ssml: string = _get(this, 'prompt.firstSimple.speech');

      if (Array.isArray(speech)) {
        for (const speechTextElement of speech) {
          if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
            return true;
          }
        }
        return false;
      } else {
        return ssml === SpeechBuilder.toSSML(speech);
      }
    }

    return true;
  }
  isFirstSimple(speech: string, text: string) {
    if (speech && this.prompt?.firstSimple?.speech !== speech) {
      return false;
    }
    if (text && this.prompt?.firstSimple?.text !== text) {
      return false;
    }
    return true;
  }

  isLastSimple(speech: string, text: string) {
    if (speech && this.prompt?.lastSimple?.speech !== speech) {
      return false;
    }
    if (text && this.prompt?.lastSimple?.text !== text) {
      return false;
    }
    return true;
  }

  hasBasicCard(card?: Card) {
    if (!this.prompt?.content?.card) {
      return false;
    }

    if (card) {
      return _isMatch(this.prompt?.content?.card, card);
    }

    return true;
  }

  isAsk(speech?: string | string[], reprompt?: string | string[]) {
    if (this.scene?.next.name === 'actions.scene.END_CONVERSATION') {
      return false;
    }
    if (speech) {
      const ssml: string = _get(this, 'prompt.firstSimple.speech');

      if (Array.isArray(speech)) {
        for (const speechTextElement of speech) {
          if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
            return true;
          }
        }
        return false;
      } else {
        if (ssml !== SpeechBuilder.toSSML(speech)) {
          return false;
        }
      }
    }

    if (reprompt) {
      const ssml: string = _get(this, 'session.params._JOVO_SESSION_.reprompts.NO_INPUT1');

      if (Array.isArray(reprompt)) {
        for (const speechTextElement of reprompt) {
          if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
            return true;
          }
        }
        return false;
      } else {
        if (ssml !== SpeechBuilder.toSSML(reprompt)) {
          return false;
        }
      }
    }
    return true;
  }

  toJSON(): ConversationalGoogleActionResponseJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this);
  }

  // fromJSON is used to convert an serialized version
  // of the User to an instance of the class
  static fromJSON(json: ConversationalGoogleActionResponseJSON | string) {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, ConversationalActionResponse.reviver);
    } else {
      // create an instance of the User class
      const alexaResponse = Object.create(ConversationalActionResponse.prototype);
      // copy all the fields from the json object
      return Object.assign(alexaResponse, json);
    }
  }

  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.
  // tslint:disable-next-line
  static reviver(key: string, value: any): any {
    return key === '' ? ConversationalActionResponse.fromJSON(value) : value;
  }
}
