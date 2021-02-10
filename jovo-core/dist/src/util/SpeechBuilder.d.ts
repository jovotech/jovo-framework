import { Jovo } from '../core/Jovo';
export interface SsmlElements {
    [tag: string]: SsmlElementAttributes;
}
export interface SsmlElementAttributes {
    [attribute: string]: string | number | boolean;
}
/** Class SpeechBuilder */
export declare class SpeechBuilder {
    static ESCAPE_AMPERSAND: boolean;
    /**
     * Adds <speak> tags to a string. Replaces & with and (v1 compatibility)
     * @param {string} text
     * @returns {string}
     */
    static toSSML(text: string): string;
    /**
     * Returns true if string is SSML
     * @param {string} text
     * @returns {boolean}
     */
    static isSSML(text: string): boolean;
    /**
     * Removes everything that is surrounded by <>
     * @param {string} ssml
     * @returns {string}
     */
    static removeSSML(ssml: string): string;
    /**
     * Removes <speak> tags from string
     * @param {string} ssml
     * @returns {string}
     */
    static removeSpeakTags(ssml: string): string;
    /**
     * Escapes XML in SSML
     *
     * @see https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
     */
    static escapeXml(unsafe: string): string;
    prosody: {};
    speech: string;
    jovo: Jovo | undefined;
    /**
     * Constructor
     * @param {Jovo} jovo instance
     * @public
     */
    constructor(jovo?: Jovo);
    /**
     * Wraps speak tags around the speech text
     */
    buildSSML(): string;
    /**
     * Adds audio tag to speech
     * @public
     * @param {string | string[]} url secure url to audio
     * @return {SpeechBuilder}
     */
    addAudio(url: string | string[], textOrConditionOrProbability?: string | string[] | boolean | number): this;
    addAudio(url: string | string[], text?: string | string[], conditionOrProbability?: boolean | number): this;
    addAudio(url: string | string[], condition?: boolean, probability?: number): this;
    addAudio(url: string | string[], text?: string | string[], condition?: boolean, probability?: number): this;
    /**
     * Adds text surrounded by <s> tags
     * @public
     * @param {string | string[]} text
     * @return {SpeechBuilder}
     */
    addSentence(text: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addSentence(text: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addSentence(text: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addSentence(text: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds <say-as> tags with interpret-as cardinal
     * @public
     * @param {number | number[]} n
     * @return {SpeechBuilder}
     */
    addSayAsCardinal(n: number | number[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addSayAsCardinal(n: number | number[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addSayAsCardinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
    addSayAsCardinal(n: number | number[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds <say-as> tags with interpret-as ordinal
     * @public
     * @param {number | number[]} n
     * @return {SpeechBuilder}
     */
    addCardinal(n: number | number[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addCardinal(n: number | number[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addCardinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
    addCardinal(n: number | number[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds <say-as> tags with interpret-as ordinal
     * @public
     * @param {number | number[]} n
     * @return {SpeechBuilder}
     */
    addSayAsOrdinal(n: number | number[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addSayAsOrdinal(n: number | number[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addSayAsOrdinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
    addSayAsOrdinal(n: number | number[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds <say-as> tags with interpret-as ordinal
     * @public
     * @param {number | number[]} n
     * @return {SpeechBuilder}
     */
    addOrdinal(n: number | number[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addOrdinal(n: number | number[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addOrdinal(n: number | number[], probability?: number, surroundSsml?: SsmlElements): this;
    addOrdinal(n: number | number[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds <say-as> tags with interpret-as characters
     * @public
     * @param {string | string[]} characters
     * @return {SpeechBuilder}
     */
    addSayAsCharacters(characters: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addSayAsCharacters(characters: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addSayAsCharacters(characters: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addSayAsCharacters(characters: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds <say-as> tags with interpret-as characters
     * @public
     * @param {string | string[]} characters
     * @return {SpeechBuilder}
     */
    addCharacters(characters: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addCharacters(characters: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addCharacters(characters: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addCharacters(characters: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds break tag to speech obj
     * @public
     * @param {string | string[]} time timespan like 3s, 500ms etc
     * @return {SpeechBuilder}
     */
    addBreak(time: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addBreak(time: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addBreak(time: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addBreak(time: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Adds text to speech
     * @public
     * @param {string | string[]} text
     * @return {SpeechBuilder}
     */
    addText(text: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addText(text: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addText(text: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addText(text: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    /**
     * Sets prosody for this speech builder, to be applied on all speech.
     * @public
     * @param {SsmlElementAttributes} prosody
     * @return {SpeechBuilder}
     */
    setProsody(prosody: SsmlElementAttributes): this;
    /**
     * Builds attribute string from attribute key-values
     * @private
     * @param {SsmlElementAttributes} attributes
     * @return {string}
     */
    buildAttributeString(attributes: SsmlElementAttributes): string;
    /**
     * Builds an enclosing tag around text
     * @private
     * @param {string} text
     * @param {string} tagName
     * @param {SsmlElementAttributes} attributes
     * @return {string}
     */
    wrapInSsmlElement(text: string, tagName: string, attributes: SsmlElementAttributes): string;
    /**
     * Adds phoneme tag to speech
     * @public
     * @param {string} text
     * @param {string} ph
     * @param {string} alphabet
     * @return {SpeechBuilder}
     */
    addPhoneme(text: string, ph: string, alphabet?: string): this;
    /**
     * Adds an x-sampa phoneme to speech
     * @public
     * @param {string} text
     * @param {string} ph
     * @return {SpeechBuilder}
     */
    addXSampa(text: string, ph: string): this;
    /**
     * Adds an ipa phoneme to speech
     * @public
     * @param {string} text
     * @param {string} ph
     * @return {SpeechBuilder}
     */
    addIpa(text: string, ph: string): this;
    /**
     * Returns speech object string
     * @deprecated use toString()
     * @public
     * @return {string}
     */
    build(): string;
    /**
     * Returns SpeechBuilder as a string
     * @return {string}
     */
    toString(): string;
    protected parseArguments(conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements, probabilityOrSurroundSsml?: number | SsmlElements, surroundSsml?: SsmlElements): {
        condition?: boolean;
        probability?: number;
        surroundSsml?: SsmlElements;
    };
    protected parseAudioArguments(url: string | string[], textOrConditionOrProbability?: string | string[] | boolean | number, conditionOrProbability?: boolean | number, probability?: number): {
        url?: string;
        text?: string;
        condition?: boolean;
        probability?: number;
    };
}
