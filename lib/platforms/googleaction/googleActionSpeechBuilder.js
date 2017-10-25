'use strict';
const _ = require('lodash');

const SpeechBuilder = require('./../speechBuilder').SpeechBuilder;

/**
 * Class GoogleActionSpeechBuilder
 */
class GoogleActionSpeechBuilder extends SpeechBuilder {
    /**
     * @param {Jovo=} jovo instance
     * Constructor
     */
    constructor(jovo) {
        super(jovo);
    }
    /**
     * Adds audio tag to speech
     * @public
     * @param {string} url secure url to audio
     * @param {string} text
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addAudio(url, text, condition, probability) {
        // gets random element from array if url
        // is of type array
        if (_.isArray(url)) {
            let rand = Math.floor(Math.random() * url.length);
            url = url[rand];
            // takes the same index from the text array
            if (!text) {
                text = url;
            } else {
                text = text[rand];
            }
        }
        return this.addText('<audio src="' + url + '">' + text + '</audio>', condition, probability);
    }
}

module.exports.GoogleActionSpeechBuilder = GoogleActionSpeechBuilder;
