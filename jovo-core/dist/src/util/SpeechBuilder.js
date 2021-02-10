"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const _sample = require("lodash.sample");
const _zip = require("lodash.zip");
/** Class SpeechBuilder */
class SpeechBuilder {
    /**
     * Constructor
     * @param {Jovo} jovo instance
     * @public
     */
    constructor(jovo) {
        this.prosody = {};
        this.speech = '';
        this.jovo = jovo;
    }
    /**
     * Adds <speak> tags to a string. Replaces & with and (v1 compatibility)
     * @param {string} text
     * @returns {string}
     */
    static toSSML(text) {
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
        text = '<speak>' + text + '</speak>';
        if (SpeechBuilder.ESCAPE_AMPERSAND) {
            // workaround (v1 compatibility)
            text = text.replace(/(&)(?=(?:[^"]|"[^"]*")*$)/g, 'and');
        }
        return text;
    }
    /**
     * Returns true if string is SSML
     * @param {string} text
     * @returns {boolean}
     */
    static isSSML(text) {
        return text.startsWith('<speak>');
    }
    /**
     * Removes everything that is surrounded by <>
     * @param {string} ssml
     * @returns {string}
     */
    static removeSSML(ssml) {
        let noSSMLText = ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
        noSSMLText = noSSMLText.replace(/<[^>]*>/g, '');
        return noSSMLText;
    }
    /**
     * Removes <speak> tags from string
     * @param {string} ssml
     * @returns {string}
     */
    static removeSpeakTags(ssml) {
        return ssml.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
    }
    /**
     * Escapes XML in SSML
     *
     * @see https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
     */
    static escapeXml(unsafe) {
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
    /**
     * Wraps speak tags around the speech text
     */
    buildSSML() {
        return SpeechBuilder.toSSML(this.speech);
    }
    addAudio(url, textOrConditionOrProbability, conditionOrProbability, probability) {
        const parsed = this.parseAudioArguments(url, textOrConditionOrProbability, conditionOrProbability, probability);
        const text = `<audio src="${parsed.url}">${parsed.text || ''}</audio>`;
        return this.addText(text, parsed.condition, parsed.probability);
    }
    addSentence(text, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addText(text, condition, probability, _merge({
            s: {},
        }, surroundSsml));
    }
    addSayAsCardinal(n, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addText(String(Array.isArray(n) ? _sample(n) : n), condition, probability, _merge({
            'say-as': {
                'interpret-as': 'cardinal',
            },
        }, surroundSsml));
    }
    addCardinal(n, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addSayAsCardinal(n, condition, probability, surroundSsml);
    }
    addSayAsOrdinal(n, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addText(String(Array.isArray(n) ? _sample(n) : n), condition, probability, _merge({
            'say-as': {
                'interpret-as': 'ordinal',
            },
        }, surroundSsml));
    }
    addOrdinal(n, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addSayAsOrdinal(n, condition, probability, surroundSsml);
    }
    addSayAsCharacters(characters, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addText(characters, condition, probability, _merge({
            'say-as': {
                'interpret-as': 'characters',
            },
        }, surroundSsml));
    }
    addCharacters(characters, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addSayAsCharacters(characters, condition, probability, surroundSsml);
    }
    addBreak(time, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const strengthValues = ['none', 'x-weak', 'weak', 'medium', 'strong', 'x-strong'];
        const breakTime = Array.isArray(time) ? _sample(time) : time;
        const attributeName = strengthValues.indexOf(breakTime) > -1 ? 'strength' : 'time';
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        return this.addText('', condition, probability, _merge({
            break: {
                [attributeName]: breakTime,
            },
        }, surroundSsml));
    }
    addText(text, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const { condition, probability, surroundSsml } = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
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
        let finalText = Array.isArray(text) ? _sample(text) : text;
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
    setProsody(prosody) {
        this.prosody = prosody;
        return this;
    }
    /**
     * Builds attribute string from attribute key-values
     * @private
     * @param {SsmlElementAttributes} attributes
     * @return {string}
     */
    buildAttributeString(attributes) {
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
    wrapInSsmlElement(text, tagName, attributes) {
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
    addPhoneme(text, ph, alphabet = 'ipa') {
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
    addXSampa(text, ph) {
        return this.addPhoneme(text, ph, 'x-sampa');
    }
    /**
     * Adds an ipa phoneme to speech
     * @public
     * @param {string} text
     * @param {string} ph
     * @return {SpeechBuilder}
     */
    addIpa(text, ph) {
        return this.addPhoneme(text, ph, 'ipa');
    }
    /**
     * Returns speech object string
     * @deprecated use toString()
     * @public
     * @return {string}
     */
    build() {
        return this.speech;
    }
    /**
     * Returns SpeechBuilder as a string
     * @return {string}
     */
    toString() {
        if (Object.keys(this.prosody).length) {
            this.speech = this.wrapInSsmlElement(this.speech, 'prosody', this.prosody);
        }
        return this.speech;
    }
    parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundSsml) {
        return {
            condition: typeof conditionOrProbabilityOrSurroundSsml === 'boolean'
                ? conditionOrProbabilityOrSurroundSsml
                : undefined,
            probability: typeof conditionOrProbabilityOrSurroundSsml === 'number'
                ? conditionOrProbabilityOrSurroundSsml
                : typeof probabilityOrSurroundSsml === 'number'
                    ? probabilityOrSurroundSsml
                    : undefined,
            surroundSsml: typeof conditionOrProbabilityOrSurroundSsml === 'object'
                ? conditionOrProbabilityOrSurroundSsml
                : typeof probabilityOrSurroundSsml === 'object'
                    ? probabilityOrSurroundSsml
                    : surroundSsml,
        };
    }
    parseAudioArguments(url, textOrConditionOrProbability, conditionOrProbability, probability) {
        let text = '';
        if (Array.isArray(url) &&
            Array.isArray(textOrConditionOrProbability) &&
            url.length === textOrConditionOrProbability.length) {
            [url, text] = _sample(_zip(url, textOrConditionOrProbability));
        }
        else {
            url = Array.isArray(url) ? _sample(url) : url;
            text =
                typeof textOrConditionOrProbability === 'string'
                    ? textOrConditionOrProbability
                    : Array.isArray(textOrConditionOrProbability)
                        ? _sample(textOrConditionOrProbability)
                        : '';
        }
        return {
            condition: typeof textOrConditionOrProbability === 'boolean'
                ? textOrConditionOrProbability
                : typeof conditionOrProbability === 'boolean'
                    ? conditionOrProbability
                    : undefined,
            probability: typeof textOrConditionOrProbability === 'number'
                ? textOrConditionOrProbability
                : typeof conditionOrProbability === 'number'
                    ? conditionOrProbability
                    : probability,
            text,
            url,
        };
    }
}
exports.SpeechBuilder = SpeechBuilder;
SpeechBuilder.ESCAPE_AMPERSAND = true;
//# sourceMappingURL=SpeechBuilder.js.map