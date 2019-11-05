import { JovoResponse, SessionData, SpeechBuilder } from 'jovo-core';
import { Message, TextMessage } from '..';

export interface MessengerBotResponseJSON {
  messages: Message[];
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
  messages: Message[];

  constructor() {
    this.messages = [];
  }

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
    const firstTextMessage = this.messages.find((message: Message) => {
      return message instanceof TextMessage;
    });
    return firstTextMessage ? (firstTextMessage as TextMessage).message.text : undefined;
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
    if (speechText) {
      return this.messages.some((message: Message) => {
        let hasSpeechText = false;
        if (message instanceof TextMessage) {
          if (typeof speechText === 'string') {
            hasSpeechText = SpeechBuilder.removeSSML(speechText) === message.message.text;
          } else {
            hasSpeechText = speechText.some((text: string) => {
              return SpeechBuilder.removeSSML(text) === message.message.text;
            });
          }
        }

        return hasSpeechText;
      });
    }

    return true;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this;
  }
}
