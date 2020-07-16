import { JovoResponse, Log, SessionData, SpeechBuilder } from 'jovo-core';
import {
  BaseResponse,
  CarouselCardResponse,
  StandaloneCardResponse,
  TextResponse,
} from '../Interfaces';

export class BusinessMessagesResponse implements JovoResponse {
  static fromJSON(json: string): BusinessMessagesResponse {
    if (typeof json === 'string') {
      return JSON.parse(json);
    } else {
      const businessMessagesResponse = Object.create(BusinessMessagesResponse.prototype);
      return Object.assign(businessMessagesResponse, json);
    }
  }

  response?: TextResponse | StandaloneCardResponse | CarouselCardResponse | BaseResponse;

  getSpeech(): string | undefined {
    const response = this.response as TextResponse;
    if (!response.text) {
      return;
    } else {
      return SpeechBuilder.removeSpeakTags(response.text);
    }
  }

  getSpeechPlain(): string | undefined {
    const speech = this.getSpeech();

    return speech ? SpeechBuilder.removeSSML(speech) : undefined;
  }

  getReprompt(): undefined {
    Log.warn("Google Business Messages doesn't support reprompts.");
    return;
  }

  getRepromptPlain(): undefined {
    Log.warn("Google Business Messages doesn't support reprompts.");
    return;
  }

  getSessionAttributes(): SessionData | undefined {
    Log.warn(
      "Google Business Messages doesn't parse session data in the response. Please use this.$session",
    );

    return;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    Log.warn(
      "Google Business Messages doesn't parse session data in the response. Please use this.$session",
    );

    return this;
  }

  getSessionData(): SessionData | undefined {
    return this.getSessionAttributes();
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  hasState(state: string): boolean | undefined {
    Log.warn(
      "Google Business Messages doesn't parse the state in the response. Please use this.getState() instead and check manually.",
    );
    return false;
  }

  hasSessionAttribute(name: string, value?: any): boolean {
    Log.warn(
      "Google Business Messages doesn't parse session data in the response. Please use this.$session and check manually",
    );

    return false;
  }

  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  hasSessionEnded(): boolean {
    Log.warn(
      "Google Business Message's response doesn't contain a flag that defines whether the session has ended or not.",
    );

    return false;
  }

  isTell(speechText?: string | string[]): boolean {
    const response = this.getSpeech();

    // response doesn't contain speech output
    if (!response) {
      return false;
    } else {
      if (speechText) {
        if (Array.isArray(speechText)) {
          for (const speechTextElement of speechText) {
            if (speechTextElement === response) {
              return true;
            }
          }
          return false;
        } else {
          return response === speechText;
        }
      }
      return true;
    }
  }

  isAsk(speechText?: string | string[]): boolean {
    return this.isTell(speechText);
  }
}
