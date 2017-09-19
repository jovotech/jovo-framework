'use strict';
const _ = require('lodash');

const SpeechBuilder = require('./../speechBuilder').SpeechBuilder;
/**
 * Class AlexaSpeechBuilder
 */
class AlexaSpeechBuilder extends SpeechBuilder {
    /**
     * Constructor
     */
    constructor() {
        super();
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
        }
        return this.addText('<audio src="' + url + '"/>', condition, probability);
    }
}

module.exports.AlexaSpeechBuilder = AlexaSpeechBuilder;
