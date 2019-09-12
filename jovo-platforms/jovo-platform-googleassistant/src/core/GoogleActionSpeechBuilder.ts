
import {SpeechBuilder} from "jovo-core";
import {GoogleAction} from "./GoogleAction";

export class GoogleActionSpeechBuilder extends SpeechBuilder {
    constructor(googleAction: GoogleAction) {
        super(googleAction);
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
    addAudio(url: string, text = '', condition?: boolean, probability?: number) {
        // gets random element from array if url
        // is of type array
        if (Array.isArray(url)) {
            const rand = Math.floor(Math.random() * url.length);
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
