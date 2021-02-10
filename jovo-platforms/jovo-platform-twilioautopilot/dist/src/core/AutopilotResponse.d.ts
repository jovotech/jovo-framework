import { JovoResponse, SessionData } from 'jovo-core';
/**
 * @see https://www.twilio.com/docs/autopilot/actions
 *
 * Twilio Autopilot response is an object containing an array of `actions`.
 * Each action is an object that contains one of the response's features.
 * For example the object with the `say` property is the normal text/voice output.
 * The object with the `play` property contains the audio file output, etc.
 */
export declare class AutopilotResponse implements JovoResponse {
    actions: any[];
    constructor();
    getSpeech(): string | undefined;
    /**
     * Autopilot doesn't support reprompts
     */
    getReprompt(): undefined;
    getSpeechPlain(): string | undefined;
    /**
     * Autopilot doesn't support reprompts
     */
    getRepromptPlain(): undefined;
    getSessionAttributes(): SessionData | undefined;
    setSessionAttributes(sessionData: SessionData): this;
    addSessionAttribute(key: string, value: any): this;
    getSessionAttribute(path: string): any;
    getSessionData(path?: string): any;
    setSessionData(sessionData: SessionData): this;
    isTell(speechText?: string | string[]): boolean;
    isAsk(speechText?: string | string[]): boolean;
    hasState(state: string): boolean | undefined;
    hasSessionData(name: string, value?: any): boolean;
    hasSessionAttribute(name: string, value?: any): boolean;
    /**
     * Returns true if there is no Listen, Collect, or Redirect action
     */
    hasSessionEnded(): boolean;
    /**
     * Returns true if the `actions` array contains a Collect action
     */
    hasCollect(): boolean;
    /**
     * Returns true if the `actions` array contains a Redirect action
     */
    hasRedirect(): boolean;
    static fromJSON(json: string): any;
}
