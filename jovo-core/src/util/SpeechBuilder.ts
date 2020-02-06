import _merge = require('lodash.merge');
import _sample = require('lodash.sample');
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
   * @param {string} url secure url to audio
   * @param {string} text
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addAudio(
    url: string | string[],
    text: string = '',
    condition?: boolean,
    probability?: number,
  ): this {
    if (Array.isArray(url)) {
      return this.addText(`<audio src="${_sample(url)}">${text}</audio>`, condition, probability);
    }
    return this.addText(`<audio src="${url}">${text}</audio>`, condition, probability);
  }

  /**
   * Adds text surrounded by <s> tags
   * @param {string} text
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addSentence(
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    return this.addText(
      Array.isArray(text) ? _sample(text)! : text,
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
   * @param {string} n
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addSayAsCardinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
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
   * @param {string} n
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addCardinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    return this.addSayAsCardinal(n, condition, probability);
  }

  /**
   * Adds <say-as> tags with interpret-as ordinal
   * @param {string} n
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addSayAsOrdinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
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
   * @param {string} n
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addOrdinal(
    n: number | number[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    return this.addSayAsOrdinal(n, condition, probability);
  }

  /**
   * Adds <say-as> tags with interpret-as characters
   * @param {string} characters
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addSayAsCharacters(
    characters: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    return this.addText(
      Array.isArray(characters) ? _sample(characters)! : characters,
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
   * @param {string} characters
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addCharacters(
    characters: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    return this.addSayAsCharacters(characters, condition, probability);
  }

  /**
   * Adds break tag to speech obj
   * @public
   * @param {string} time timespan like 3s, 500ms etc
   * @param {boolean} condition
   * @param {number} probability
   * @return {SpeechBuilder}
   */
  addBreak(
    time: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    const strengthValues = ['none', 'x-weak', 'weak', 'medium', 'strong', 'x-strong'];
    const breakTime = Array.isArray(time) ? _sample(time)! : time;
    const attributeName = strengthValues.indexOf(breakTime) > -1 ? 'strength' : 'time';
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
   * @param {string} text
   * @param {boolean} condition
   * @param {number} probability
   * @param {SsmlElement}  ssml element description
   * @return {SpeechBuilder}
   */
  addText(
    text: string | string[],
    condition?: boolean,
    probability?: number,
    surroundSsml?: SsmlElements,
  ): this {
    if (typeof condition === 'boolean' && condition === false) {
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
}
