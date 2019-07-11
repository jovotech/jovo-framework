
import {SpeechBuilder} from "jovo-core";
import {GoogleAction} from "./GoogleAction";

export class GoogleActionSpeechBuilder extends SpeechBuilder {
    constructor(googleAction: GoogleAction) {
        super(googleAction);
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
