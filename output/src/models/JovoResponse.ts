export abstract class JovoResponse {
  [key: string]: unknown;

  abstract hasSessionEnded(): boolean;

  /**
   * Returns speech (SSML) from the platform response
   * Relevant if the speech needs to be modified after the response.output middleware
   *
   * @remarks
   * This only needs to be implemented by platform responses that support SSML
   *
   * @returns the speech value as a string
   * (array if the response contains multiple items)
   */
  getSpeech?(): string | string[] | undefined;

  /**
   * Replaces speech (SSML) with the passed parameter
   * Relevant if the speech was modified, e.g. by a TTS plugin
   *
   * @remarks
   * This only needs to be implemented by platform responses that support SSML
   *
   * @param speech - for responses that contain multiple items, this can be an array
   */
  replaceSpeech?(speech: string | string[]): void;

  /**
   * Returns reprompt speech (SSML) from the platform response
   * Relevant if the reprompt needs to be modified after the response.output middleware
   *
   * @remarks
   * This only needs to be implemented by platform responses that support SSML
   *
   * @returns the reprompt speech value as a string
   * (array if the response contains multiple items)
   */
  getReprompt?(): string | string[] | undefined;

  /**
   * Replaces reprompt (SSML) with the passed parameter
   * Relevant if the reprompt was modified, e.g. by a TTS plugin
   *
   * @remarks
   * This only needs to be implemented by platform responses that support SSML
   *
   * @param reprompt - for responses that contain multiple items, this can be an array
   */
  replaceReprompt?(reprompt: string | string[]): void;
}
