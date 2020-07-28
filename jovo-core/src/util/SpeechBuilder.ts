import _merge = require('lodash.merge');
import _sample = require('lodash.sample');
import _zip = require('lodash.zip');
import { Jovo } from '../core/Jovo';

export interface SsmlElements {
  [tag: string]: SsmlElementAttributes;
}

export interface SsmlElementAttributes {
  [attribute: string]: string | number | boolean;
}

/** Class SpeechBuilder */
export class SpeechBuilder {
  static ESCAPE_AMPERSAND = true;

  /**
   * Adds <speak> tags to a string. Replaces & with and (v1 compatibility)
   * @param {string} text
   * @returns {string}
   */
  static toSSML(text: string): string {
    text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
    text = '<speak>' + text + '</speak>';

    if (SpeechBuilder.ESCAPE_AMPERSAND) {
      // workaround (v1 compatibility)
      text = text.replace(/&/g, 'and');
    }

    return text;
  }

  /**
   * Removes everything that is surrounded by <>
   * @param {string} ssml
   * @returns {string}
   */
  static removeSSML(ssml: string): string {
    let noSSMLText = ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
    noSSMLText = noSSMLText.replace(/<[^>]*>/g, '');
    return noSSMLText;
  }

  /**
   * Removes <speak> tags from string
   * @param {string} ssml
   * @returns {string}
   */
  static removeSpeakTags(ssml: string): string {
    return ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
  }

  /**
   * Escapes XML in SSML
   *
   * @see https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
   */
  static escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        default:
        case '"':
          return '&quot;';
      }
    });
  }

  prosody = {};
  speech = '';
  jovo: Jovo | undefined;

  /**
   * Constructor
   * @param {Jovo} jovo instance
   * @public
   */
  constructor(jovo?: Jovo) {
    this.jovo = jovo;
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
    const text = `<audio src="${parsed.url}">${parsed.text || ''}</audio>`;

    return this.addText(text, parsed.condition, parsed.probability);
  }

  /**
   * Adds text surrounded by <s> tags
   * @public
   * @param {string | string[]} text
   * @return {SpeechBuilder}
   */
  addSentence(
    text: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addSentence(
    text: string | string[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addSentence(text: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
  addSentence(
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addSentence(
    text: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addText(
      text,
      condition,
      probability,
      _merge(
        {
          s: {},
        },
        surroundSsml,
      ),
    );
  }

  /**
   * Adds <say-as> tags with interpret-as cardinal
   * @public
   * @param {number | number[]} n
   * @return {SpeechBuilder}
   */
  addSayAsCardinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addSayAsCardinal(
    n: number | number[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addSayAsCardinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
  addSayAsCardinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addSayAsCardinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addText(
      String(Array.isArray(n) ? _sample(n) : n),
      condition,
      probability,
      _merge(
        {
          'say-as': {
            'interpret-as': 'cardinal',
          },
        },
        surroundSsml,
      ),
    );
  }

  /**
   * Adds <say-as> tags with interpret-as ordinal
   * @public
   * @param {number | number[]} n
   * @return {SpeechBuilder}
   */
  addCardinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addCardinal(
    n: number | number[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addCardinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
  addCardinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addCardinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addSayAsCardinal(n, condition, probability, surroundSsml);
  }

  /**
   * Adds <say-as> tags with interpret-as ordinal
   * @public
   * @param {number | number[]} n
   * @return {SpeechBuilder}
   */
  addSayAsOrdinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addSayAsOrdinal(
    n: number | number[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addSayAsOrdinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
  addSayAsOrdinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addSayAsOrdinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addText(
      String(Array.isArray(n) ? _sample(n) : n),
      condition,
      probability,
      _merge(
        {
          'say-as': {
            'interpret-as': 'ordinal',
          },
        },
        surroundSsml,
      ),
    );
  }

  /**
   * Adds <say-as> tags with interpret-as ordinal
   * @public
   * @param {number | number[]} n
   * @return {SpeechBuilder}
   */
  addOrdinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addOrdinal(
    n: number | number[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addOrdinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
  addOrdinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addOrdinal(
    n: number | number[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addSayAsOrdinal(n, condition, probability, surroundSsml);
  }

  /**
   * Adds <say-as> tags with interpret-as characters
   * @public
   * @param {string | string[]} characters
   * @return {SpeechBuilder}
   */
  addSayAsCharacters(
    characters: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addSayAsCharacters(
    characters: string | string[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addSayAsCharacters(
    characters: string | string[],
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addSayAsCharacters(
    characters: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addSayAsCharacters(
    characters: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addText(
      characters,
      condition,
      probability,
      _merge(
        {
          'say-as': {
            'interpret-as': 'characters',
          },
        },
        surroundSsml,
      ),
    );
  }

  /**
   * Adds <say-as> tags with interpret-as characters
   * @public
   * @param {string | string[]} characters
   * @return {SpeechBuilder}
   */
  addCharacters(
    characters: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addCharacters(
    characters: string | string[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addCharacters(
    characters: string | string[],
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addCharacters(
    characters: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addCharacters(
    characters: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addSayAsCharacters(characters, condition, probability, surroundSsml);
  }

  /**
   * Adds break tag to speech obj
   * @public
   * @param {string | string[]} time timespan like 3s, 500ms etc
   * @return {SpeechBuilder}
   */
  addBreak(
    time: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
  ): this;
  addBreak(
    time: string | string[],
    condition?: boolean,
    probabilityOrSurroundSsml?: number | SsmlElements,
  ): this;
  addBreak(time: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
  addBreak(
    time: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this;
  addBreak(
    time: string | string[],
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundBySsml?: SsmlElements,
  ): this {
    const strengthValues = ['none', 'x-weak', 'weak', 'medium', 'strong', 'x-strong'];
    const breakTime = Array.isArray(time) ? _sample(time)! : time;
    const attributeName = strengthValues.indexOf(breakTime) > -1 ? 'strength' : 'time';
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    return this.addText(
      '',
      condition,
      probability,
      _merge(
        {
          break: {
            [attributeName]: breakTime,
          },
        },
        surroundSsml,
      ),
    );
  }

  /**
   * Adds text to speech
   * @public
   * @param {string | string[]} text
   * @return {SpeechBuilder}
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
    const { condition, probability, surroundSsml } = this.parseArguments(
      conditionOrProbabilityOrSurroundSsml,
      probabilityOrSurroundSsml,
      surroundBySsml,
    );
    if (typeof condition === 'boolean' && !condition) {
      return this;
    }
    if (typeof probability === 'number') {
      if (Math.random() >= probability) {
        return this;
      }
    }
    if (this.speech.length > 0) {
      this.speech += ' ';
    }

    let finalText = Array.isArray(text) ? _sample(text)! : text;

    if (typeof surroundSsml === 'object') {
      Object.entries(surroundSsml).forEach(([tagName, attributes]) => {
        finalText = this.wrapInSsmlElement(finalText, tagName, attributes);
      });
    }

    this.speech += finalText;

    return this;
  }

  /**
   * Sets prosody for this speech builder, to be applied on all speech.
   * @public
   * @param {SsmlElementAttributes} prosody
   * @return {SpeechBuilder}
   */
  setProsody(prosody: SsmlElementAttributes) {
    this.prosody = prosody;
    return this;
  }

  /**
   * Builds attribute string from attribute key-values
   * @private
   * @param {SsmlElementAttributes} attributes
   * @return {string}
   */
  buildAttributeString(attributes: SsmlElementAttributes) {
    return Object.entries(attributes)
      .map(([attrName, attrVal]) => ` ${attrName}="${attrVal}"`)
      .join('');
  }

  /**
   * Builds an enclosing tag around text
   * @private
   * @param {string} text
   * @param {string} tagName
   * @param {SsmlElementAttributes} attributes
   * @return {string}
   */
  wrapInSsmlElement(text: string, tagName: string, attributes: SsmlElementAttributes) {
    return text
      ? `<${tagName}${this.buildAttributeString(attributes)}>${text}</${tagName}>`
      : `<${tagName}${this.buildAttributeString(attributes)}/>`;
  }

  /**
   * Adds phoneme tag to speech
   * @public
   * @param {string} text
   * @param {string} ph
   * @param {string} alphabet
   * @return {SpeechBuilder}
   */
  addPhoneme(text: string, ph: string, alphabet = 'ipa'): this {
    return this.addText(text, undefined, undefined, {
      phoneme: {
        alphabet,
        ph: SpeechBuilder.escapeXml(ph),
      },
    });
  }

  /**
   * Adds an x-sampa phoneme to speech
   * @public
   * @param {string} text
   * @param {string} ph
   * @return {SpeechBuilder}
   */
  addXSampa(text: string, ph: string): this {
    return this.addPhoneme(text, ph, 'x-sampa');
  }

  /**
   * Adds an ipa phoneme to speech
   * @public
   * @param {string} text
   * @param {string} ph
   * @return {SpeechBuilder}
   */
  addIpa(text: string, ph: string): this {
    return this.addPhoneme(text, ph, 'ipa');
  }

  /**
   * Returns speech object string
   * @deprecated use toString()
   * @public
   * @return {string}
   */
  build(): string {
    return this.speech;
  }

  /**
   * Returns SpeechBuilder as a string
   * @return {string}
   */
  toString(): string {
    if (Object.keys(this.prosody).length) {
      this.speech = this.wrapInSsmlElement(this.speech, 'prosody', this.prosody);
    }
    return this.speech;
  }

  protected parseArguments(
    conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements,
    probabilityOrSurroundSsml?: number | SsmlElements,
    surroundSsml?: SsmlElements,
  ): { condition?: boolean; probability?: number; surroundSsml?: SsmlElements } {
    return {
      condition:
        typeof conditionOrProbabilityOrSurroundSsml === 'boolean'
          ? conditionOrProbabilityOrSurroundSsml
          : undefined,
      probability:
        typeof conditionOrProbabilityOrSurroundSsml === 'number'
          ? conditionOrProbabilityOrSurroundSsml
          : typeof probabilityOrSurroundSsml === 'number'
          ? probabilityOrSurroundSsml
          : undefined,
      surroundSsml:
        typeof conditionOrProbabilityOrSurroundSsml === 'object'
          ? conditionOrProbabilityOrSurroundSsml
          : typeof probabilityOrSurroundSsml === 'object'
          ? probabilityOrSurroundSsml
          : surroundSsml,
    };
  }

  protected parseAudioArguments(
    url: string | string[],
    textOrConditionOrProbability?: string | string[] | boolean | number,
    conditionOrProbability?: boolean | number,
    probability?: number,
  ): { url?: string; text?: string; condition?: boolean; probability?: number } {
    let text: string | undefined = '';
    if (
      Array.isArray(url) &&
      Array.isArray(textOrConditionOrProbability) &&
      url.length === textOrConditionOrProbability.length
    ) {
      [url, text] = _sample(_zip(url, textOrConditionOrProbability)) as [string, string];
    } else {
      url = Array.isArray(url) ? _sample(url)! : url;

      text =
        typeof textOrConditionOrProbability === 'string'
          ? textOrConditionOrProbability
          : Array.isArray(textOrConditionOrProbability)
          ? _sample(textOrConditionOrProbability)
          : '';
    }
    return {
      condition:
        typeof textOrConditionOrProbability === 'boolean'
          ? textOrConditionOrProbability
          : typeof conditionOrProbability === 'boolean'
          ? conditionOrProbability
          : undefined,
      probability:
        typeof textOrConditionOrProbability === 'number'
          ? textOrConditionOrProbability
          : typeof conditionOrProbability === 'number'
          ? conditionOrProbability
          : probability,
      text,
      url,
    };
  }
}
