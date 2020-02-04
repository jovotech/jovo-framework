import _sample = require('lodash.sample');
import { SpeechBuilder } from 'jovo-core';
import { AlexaSkill } from './AlexaSkill';
import { SsmlElements } from 'jovo-core/dist/src/util/SpeechBuilder';
import { EmotionIntensity, EmotionName } from './Interfaces';

export class AlexaSpeechBuilder extends SpeechBuilder {
  static pollyVoice: string | undefined;

  constructor(alexaSkill: AlexaSkill) {
    super(alexaSkill);
  }

  /**
   * Adds text with language
   * @param {string} language
   * @param {string | string[]} text
   * @param {boolean} condition
   * @param {number} probability
   * @returns {SpeechBuilder}
   */
  addLangText(
    language: string,
    text: string | string[],
    condition?: boolean,
    probability?: number,
  ): this {
    if (Array.isArray(text)) {
      return this.addText(
        `<lang xml:lang="${language}">${_sample(text)}</lang>`,
        condition,
        probability,
      );
    }
    return this.addText(`<lang xml:lang="${language}">${text}</lang>`, condition, probability);
  }

  /**
   * Adds text with polly
   * @param {string} pollyName
   * @param {string | string[]} text
   * @param {boolean} condition
   * @param {number} probability
   * @returns {SpeechBuilder}
   */
  addTextWithPolly(
    pollyName: string,
    text: string | string[],
    condition?: boolean,
    probability?: number,
  ): this {
    const surroundSsml = {
      voice: {
        name: pollyName,
      },
    };
    return this.addText(text, condition, probability, surroundSsml);
  }

  /**
   * Overrides addText and adds polly voice tags if a polly voice has been set.
   * @param {string | string[]} text
   * @param {boolean} condition
   * @param {number} probability
   * @returns {this}
   */
  addText(
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    if (AlexaSpeechBuilder.pollyVoice) {
      if (!surroundSsml) {
        surroundSsml = {};
      }

      surroundSsml.voice = {
        name: AlexaSpeechBuilder.pollyVoice,
      };
    }

    return super.addText(text, condition, probability, surroundSsml);
  }

  addEmotion(
    name: EmotionName,
    intensity: EmotionIntensity,
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml: SsmlElements = {},
  ): this {
    surroundSsml['amazon:emotion'] = { name, intensity };
    return this.addText(text, condition, probability, surroundSsml);
  }
}
