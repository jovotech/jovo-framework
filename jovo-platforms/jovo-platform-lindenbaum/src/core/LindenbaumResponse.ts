import { JovoResponse, SpeechBuilder, Log, SessionData } from 'jovo-core';

export class LindenbaumResponse implements JovoResponse {
  static fromJSON(json: string): LindenbaumResponse {
    if (typeof json === 'string') {
      return JSON.parse(json);
    } else {
      const lindenbaumResponse = Object.create(LindenbaumResponse.prototype);
      return Object.assign(lindenbaumResponse, json);
    }
  }

  /**
   * array of responses. Each response has its API path as the key and the API request's body
   * as the value. See `SayResponse` for reference
   */
  // tslint:disable-next-line:no-any
  responses: any[];

  constructor() {
    this.responses = [];
  }

  getSpeech(): string | undefined {
    const speechResponses: SayResponse[] = this.responses.filter((response) => {
      return response['/call/say'];
    });

    if (speechResponses.length < 1) return;

    /**
     * Removes the SSML <speak> tags and pads the strings that are in the middle
     * of the array with a empty string at the beginning.
     * That way, each array element will be separated correctly when we return the reduced string.
     */
    const formattedSpeechResponses = speechResponses.map((response, index) => {
      response['/call/say'].text = SpeechBuilder.removeSpeakTags(response['/call/say'].text);
      if (index > 0 && index < speechResponses.length - 1) {
        response['/call/say'].text = ' ' + response['/call/say'].text;
      }
      return response;
    });

    return formattedSpeechResponses.reduce((acc, curr) => acc + curr['/call/say'].text, '');
  }

  getSpeechPlain(): string | undefined {
    const speech = this.getSpeech();

    return speech ? SpeechBuilder.removeSSML(speech) : undefined;
  }

  /**
   * Lindenbaum doesn't support reprompts
   */
  getReprompt(): undefined {
    Log.warn("Lindenbaum doesn't support reprompts.");
    return;
  }

  getRepromptPlain(): undefined {
    Log.warn("Lindenbaum doesn't support reprompts.");
    return;
  }

  /**
   * There are no session attributes stored in the Lindenbaum response.
   * always returns `undefined`
   */
  getSessionAttributes(): undefined {
    Log.warn(
      "Lindenbaum doesn't parse session data in the response. Please use this.$session.$data",
    );
    return;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    Log.warn(
      "Lindenbaum doesn't parse session data in the response. Please use this.$session.$data",
    );
    return this;
  }

  /**
   * There are no session attributes stored in the Lindenbaum response.
   * always returns `undefined`
   */
  getSessionData(): undefined {
    Log.warn(
      "Lindenbaum doesn't parse session data in the response. Please use this.$session.$data",
    );
    return;
  }

  /**
   * There are no session attributes stored in the Lindenbaum response.
   * always returns `undefined`
   */
  setSessionData(sessionData: SessionData): this {
    Log.warn(
      "Lindenbaum doesn't parse session data in the response. Please use this.$session.$data",
    );
    return this;
  }

  hasState(state: string): boolean {
    Log.warn(
      "Lindenbaum doesn't parse session data in the request. Please use this.getState() instead and check manually.",
    );
    return false;
  }

  // tslint:disable-next-line:no-any
  hasSessionData(name: string, value?: any): boolean {
    Log.warn(
      "Lindenbaum doesn't parse session data in the response. Please use this.$session.$data",
    );
    return false;
  }

  // tslint:disable-next-line:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    Log.warn(
      "Lindenbaum doesn't parse session data in the response. Please use this.$session.$data",
    );
    return false;
  }

  isTell(speechText?: string | string[]): boolean {
    const hasDropResponse = this.responses.some((response) => {
      return response['/call/drop'];
    });

    if (!hasDropResponse) {
      return false; // session doesn't end -> can't be tell()
    }

    const sayResponses: SayResponse[] = this.responses.filter((response) => {
      return response['/call/say'];
    });

    if (sayResponses.length === 0) {
      return false; // no speech output -> can't be tell()
    }

    if (speechText) {
      /**
       * we have to check if any of speechText's elements are equal to
       * any of speech outputs in the response
       */
      if (Array.isArray(speechText)) {
        for (const speech of speechText) {
          const speechTextIsInResponses = sayResponses.some((response) => {
            return response['/call/say'].text === SpeechBuilder.toSSML(speech);
          });

          if (speechTextIsInResponses) {
            return true;
          }
        }
      } else {
        return sayResponses.some((response) => {
          return response['/call/say'].text === SpeechBuilder.toSSML(speechText);
        });
      }
    }

    return true;
  }

  isAsk(speechText?: string | string[]): boolean {
    const hasDropResponse = this.responses.some((response) => {
      return response['/call/drop'];
    });

    if (hasDropResponse) {
      return false; // session ends -> can't be ask()
    }

    const sayResponses: SayResponse[] = this.responses.filter((response) => {
      return response['/call/say'];
    });

    if (sayResponses.length === 0) {
      return false; // no speech output -> can't be ask()
    }

    if (speechText) {
      /**
       * we have to check if any of speechText's elements are equal to
       * any of speech outputs in the response
       */
      if (Array.isArray(speechText)) {
        for (const speech of speechText) {
          const speechTextIsInResponses = sayResponses.some((response) => {
            return response['/call/say'].text === SpeechBuilder.toSSML(speech);
          });

          if (speechTextIsInResponses) {
            return true;
          }
        }
      } else {
        return sayResponses.some((response) => {
          return response['/call/say'].text === SpeechBuilder.toSSML(speechText);
        });
      }
    }

    return true;
  }

  hasSessionEnded(): boolean {
    return this.responses.some((response) => {
      return response['/call/drop'];
    });
  }
}

// simple text output
export interface SayResponse {
  '/call/say': {
    dialogId: string;
    text: string;
    language: string;
    bargeIn: boolean;
  };
}

// end call
export interface DropResponse {
  '/call/drop': {
    dialogId: string;
  };
}

// bridge call to different destination
export interface BridgeResponse {
  '/call/bridge': {
    dialogId: string;
    headNumber: string;
    extensionLength: number;
  };
}

// forward call to different destination
export interface ForwardResponse {
  '/call/forward': {
    dialogId: string;
    destinationNumber: string;
  };
}

/**
 * send data to the call, used in Dialog API
 * (https://app.swaggerhub.com/apis/Lindenbaum-GmbH/CVP-Dialog-API/1.0.10)
 */
export interface DataResponse {
  '/call/data': {
    dialogId: string;
    key: string;
    value: string;
  };
}

export type Responses =
  | SayResponse
  | DropResponse
  | BridgeResponse
  | ForwardResponse
  | DataResponse;
