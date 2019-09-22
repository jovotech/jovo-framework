import _sample = require('lodash.sample');
import _zip = require('lodash.zip');

import {SpeechBuilder} from "jovo-core";
import {GoogleAction} from "./GoogleAction";

export class GoogleActionSpeechBuilder extends SpeechBuilder {
    constructor(googleAction: GoogleAction) {
        super(googleAction);
    }
    /**
     * Adds audio tag to speech
     * @public
     * @param {string | string[]} url secure url to audio
     * @param {string | string[]} text
     * @param {boolean} condition
     * @param {number} probability
     * @return {SpeechBuilder}
     */
    addAudio(url: string | string[], text?: string | string[], condition?: boolean, probability?: number) {
        // gets random element from array if url
        // is of type array
        if (Array.isArray(url) && Array.isArray(text) && text.length === url.length) {
            // takes the same index from the text array
            [url, text] = (_sample(_zip(url, text)) as string[]);
        } else {
            if (Array.isArray(url)) {
                url = (_sample(url) as string);
            }
            if (Array.isArray(text)) {
                text = (_sample(text) as string);
            }
        }
        if (!text) {
            text = '';
        }
        return this.addText('<audio src="' + url + '"' + ((text.length > 0) ? '>' + text + '</audio>' : '/>'), condition, probability);
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
