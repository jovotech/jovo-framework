import _sample = require('lodash.sample');
import { SpeechBuilder } from 'jovo-core';
import { SsmlElements } from 'jovo-core/dist/src/util/SpeechBuilder';
import { AlexaSkill } from './AlexaSkill';
import { EmotionIntensity, EmotionName } from './Interfaces';

export class AlexaSpeechBuilder extends SpeechBuilder {
  static pollyVoice: string | undefined;

  constructor(alexaSkill: AlexaSkill) {
    super(alexaSkill);
  }

  /**
   * Adds text with language
   * @public
   * @param {string} language
   * @param {string | string[]} text
   * @returns {SpeechBuilder}
   */
  addLangText(
    language: string,
    text: string | string[],
    conditionOrProbability?: boolean | number,
  ): this;
  addLangText(
    language: string,
    text: string | string[],
    condition?: boolean,
    probability?: number,
  ): this;
  addLangText(
    language: string,
    text: string | string[],
    conditionOrProbability?: boolean | number,
    probability?: number,
  ): this {
    const finalText = Array.isArray(text) ? _sample(text)! : text;
    const condition =
      typeof conditionOrProbability === 'boolean' ? conditionOrProbability : undefined;
    probability = typeof conditionOrProbability === 'number' ? conditionOrProbability : probability;
    return this.addText(`<lang xml:lang="${language}">${finalText}</lang>`, condition, probability);
  }

  /**
   * Adds text with polly
   * @public
   * @param {string} pollyName
   * @param {string | string[]} text
   * @returns {SpeechBuilder}
   */
  addTextWithPolly(
    pollyName: string,
    text: string | string[],
    conditionOrProbability?: boolean | number,
  ): this;
  addTextWithPolly(
    pollyName: string,
    text: string | string[],
    condition?: boolean,
    probability?: number,
  ): this;
  addTextWithPolly(
    pollyName: string,
    text: string | string[],
    conditionOrProbability?: boolean | number,
    probability?: number,
  ): this {
    const condition =
      typeof conditionOrProbability === 'boolean' ? conditionOrProbability : undefined;
    probability = typeof conditionOrProbability === 'number' ? conditionOrProbability : probability;
    const surroundSsml = {
      voice: {
        name: pollyName,
      },
    };
    return this.addText(text, condition, probability, surroundSsml);
  }

  /**
   * Overrides addText and adds polly voice tags if a polly voice has been set.
   * @public
   * @param {string | string[]} text
   * @returns {this}
   */
  addText(
    text: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addText(
    text: string | string[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addText(text: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
  addText(
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addText(
    text: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const parsed = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    let surroundSsml = parsed.surroundSsml;
    if (AlexaSpeechBuilder.pollyVoice) {
      if (!surroundSsml) {
        surroundSsml = {};
      }
      surroundSsml.voice = {
        name: AlexaSpeechBuilder.pollyVoice,
      };
    }
    return super.addText(text, parsed.condition, parsed.probability, surroundSsml);
  }

  addEmotion(
    name: EmotionName,
    intensity: EmotionIntensity,
    text: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addEmotion(
    name: EmotionName,
    intensity: EmotionIntensity,
    text: string | string[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addEmotion(
    name: EmotionName,
    intensity: EmotionIntensity,
    text: string | string[],
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addEmotion(
    name: EmotionName,
    intensity: EmotionIntensity,
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addEmotion(
    name: EmotionName,
    intensity: EmotionIntensity,
    text: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const parsed = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    const surroundSsml = parsed.surroundSsml || {};

    surroundSsml['amazon:emotion'] = { name, intensity };
    return this.addText(text, parsed.condition, parsed.probability, surroundSsml);
  }
}
