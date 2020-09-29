import { JovoResponse, SessionData, SpeechBuilder } from 'jovo-core';
import { Message, TextMessage } from '..';

export interface MessengerBotResponseJSON {
  message?: Message;
}

export class MessengerBotResponse implements JovoResponse {
  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    return key === '' ? MessengerBotResponse.fromJSON(value) : value;
  }

  static fromJSON(json: MessengerBotResponseJSON | string): MessengerBotResponse {
    if (typeof json === 'string') {
      return JSON.parse(json, MessengerBotResponse.reviver);
    }

    const response = Object.create(MessengerBotResponse.prototype);
    return Object.assign(response, json);
  }
  message?: Message;

  getReprompt(): string | undefined {
    return undefined;
  }

  getRepromptPlain(): string | undefined {
    return undefined;
  }

  getSessionAttributes(): SessionData | undefined {
    return undefined;
  }

  getSessionData(): SessionData | undefined {
    return undefined;
  }

  getSpeech(): string | undefined {
    return this.getSpeechPlain();
  }

  getSpeechPlain(): string | undefined {
    return this.message instanceof TextMessage ? this.message.message.text : undefined;
  }

  hasSessionAttribute(name: string, value?: any): boolean {
    return false;
  }

  hasSessionData(name: string, value?: any): boolean {
    return false;
  }

  hasSessionEnded(): boolean {
    return true;
  }

  hasState(state: string): boolean | undefined {
    return undefined;
  }

  isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
    return this.isTell(speechText);
  }

  isTell(speechText?: string | string[]): boolean {
    if (speechText && this.message) {
      return this.message instanceof TextMessage
        ? typeof speechText === 'string'
          ? SpeechBuilder.removeSSML(speechText) === this.message.message.text
          : speechText.some((text) => {
              return SpeechBuilder.removeSSML(text) === (this.message as TextMessage).message.text;
            })
        : false;
    }
    return this.message instanceof TextMessage;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this;
  }
}
