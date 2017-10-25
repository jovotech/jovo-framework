'use strict';
const _ = require('lodash');

/** Class SpeechBuilder */
class SpeechBuilder {

    /**
     * Constructor
     * @param {Jovo=} jovo instance
     * @public
     */
    constructor(jovo) {
        this.speech = '';
        this.jovo = jovo;
    }

    /**
     * Adds text surrounded by <s> tags
     * @param {string} text
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSentence(text, condition, probability) {
        if (_.isArray(text)) {
            text = _.sample(text);
        }
        return this.addText('<s>' + text + '</s>', condition, probability);
    }

    /**
     * Adds <say-as> tags with interpret-as cardinal
     * @param {string} number
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSayAsCardinal(number, condition, probability) {
        if (_.isArray(number)) {
            number = _.sample(number);
        }
        return this.addText('<say-as interpret-as="cardinal">'+number+'</say-as>', condition, probability);
    }

    /**
     * Adds <say-as> tags with interpret-as ordinal
     * @param {string} number
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSayAsOrdinal(number, condition, probability) {
        if (_.isArray(number)) {
            number = _.sample(number);
        }
        return this.addText('<say-as interpret-as="ordinal">'+number+'</say-as>', condition, probability);
    }

    /**
     * Adds <say-as> tags with interpret-as characters
     * @param {string} characters
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSayAsCharacters(characters, condition, probability) {
        if (_.isArray(characters)) {
            characters = _.sample(characters);
        }
        return this.addText('<say-as interpret-as="characters">'+characters+'</say-as>', condition, probability);
    }

    /**
     * Adds break tag to speech obj
     * @public
     * @param {string} time timespan like 3s, 500ms etc
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addBreak(time, condition, probability) {
        const strengthValues = ['none', 'x-weak', 'weak', 'medium', 'strong', 'x-strong'];
        if (_.isArray(time)) {
            time = _.sample(time);
        }
        if (strengthValues.indexOf(time) > -1) {
            return this.addText('<break strength="' + time + '"/>', condition, probability);
        } else {
            return this.addText('<break time="' + time + '"/>', condition, probability);
        }
    }
    /**
     * Adds text to speech
     * @public
     * @param {string} text
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addText(text, condition, probability) {
        if (_.isBoolean(condition) && condition === false) {
            return this;
        }
        if (_.isNumber(probability)) {
            if (Math.random() >= probability) {
                return this;
            }
        }
        if (this.speech.length > 0) {
            this.speech += ' ';
        }

        // gets random element from array if text
        // is of type array
        if (_.isArray(text)) {
            text = _.sample(text);
        }

        this.speech += text;
        return this;
    }

    /**
     * Generates ssml from text. Removes existing <speak> tags
     * @public
     * @static
     * @param {string} text
     * @return {string} ssml
     */
    static toSSML(text) {
        if (!text) {
            throw Error('Invalid output text: ' + text);
        }
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
        text = text.replace(/&/g, 'and');

        text = '<speak>' + text + '</speak>';
        return text;
    }

    /**
     * Translates a path with values provided
     * @public
     * @param {string} path to the resource to translate
     * @param {*} values to replace inside the path
     * @return {string}
     */
    t() {
        if (!this.jovo) {
           throw new Error('Initialize speech builder with jovo instance');
        }
        let text =  this.jovo.t.apply(this.jovo, arguments); // eslint-disable-line
        this.addText(text);
        return this;
    }

    /**
     * Returns speech object string
     * @public
     * @return {string}
     */
    build() {
        return this.speech;
    }
}
module.exports.SpeechBuilder = SpeechBuilder;
