import { SpeechBuilder } from 'jovo-core';
import { GoogleAction } from './GoogleAction';

export class GoogleActionSpeechBuilder extends SpeechBuilder {
  constructor(googleAction: GoogleAction) {
    super(googleAction);
  }

  /**
   * Adds audio tag to speech
   * @public
   * @param {string | string[]} url secure url to audio
   * @return {SpeechBuilder}
   */
  addAudio(
    url: string | string[],
    textOrConditionOrProbability?: string | string[] | boolean | number,
  ): this;
  addAudio(
    url: string | string[],
    text?: string | string[],
    conditionOrProbability?: boolean | number,
  ): this;
  addAudio(url: string | string[], condition?: boolean, probability?: number): this;
  addAudio(
    url: string | string[],
    text?: string | string[],
    condition?: boolean,
    probability?: number,
  ): this;
  addAudio(
    url: string | string[],
    textOrConditionOrProbability?: string | string[] | boolean | number,
    conditionOrProbability?: boolean | number,
    probability?: number,
  ): this {
    const parsed = this.parseAudioArguments(
      url,
      textOrConditionOrProbability,
      conditionOrProbability,
      probability,
    );
    const text = parsed.text?.length
      ? `<audio src="${parsed.url}">${parsed.text}</audio>`
      : `<audio src="${parsed.url}"/>`;

    return this.addText(text, parsed.condition, parsed.probability);
  }

  /**
   * Adds the plain text as Google does not support <phoneme>
   * @public
   * @param {string} text
   * @param {string} ph
   * @param {string} alphabet
   * @return {this}
   */
  addPhoneme(text: string, ph: string, alphabet: string) {
    return this.addText(text);
  }
}
