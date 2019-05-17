import _sample = require('lodash.sample');
import {SpeechBuilder} from "jovo-core";
import {AlexaSkill} from "./AlexaSkill";
import {SsmlElements} from "jovo-core/dist/src/SpeechBuilder";


export class AlexaSpeechBuilder extends SpeechBuilder {

    static pollyVoice: string | undefined;

    constructor(alexaSkill: AlexaSkill) {
        super(alexaSkill);
    }
    /**
     * Adds audio tag to speech
     * @public
     * @param {string} url secure url to audio
     * @param {boolean} condition
     * @param {number} probability
     * @return {SpeechBuilder}
     */
    addAudio(url: string | string[], condition?: boolean, probability?: number): this {
        if (Array.isArray(url)) {
            return this.addText('<audio src="' + _sample(url)  + '"/>', condition, probability);
        }
        return this.addText('<audio src="' + url  + '"/>', condition, probability);
    }

    /**
     * Adds text with language
     * @param {string} language
     * @param {string | string[]} text
     * @param {boolean} condition
     * @param {number} probability
     * @returns {SpeechBuilder}
     */
    addLangText(language: string, text: string | string[], condition?: boolean, probability?: number): this {
        if (Array.isArray(text)) {
            return this.addText(`<lang xml:lang="${language}">${_sample(text)}</lang>`, condition, probability);
        }
        return this.addText(`<lang xml:lang="${language}">${text}</lang>`, condition, probability);
    }

    /**
     * Adds text with polly
     * @param {string} pollyName
     * @param {string | string[]} text
     * @param {boolean} condition
     * @param {number} probability
     * @returns {SpeechBuilder}
     */
    addTextWithPolly(pollyName: string, text: string | string[], condition?: boolean, probability?: number): this {
        if (Array.isArray(text)) {
            return this.addText(`<voice name="${pollyName}">${_sample(text)}</voice>`, condition, probability);
        }
        return this.addText(`<voice name="${pollyName}">${text}</voice>`, condition, probability);
    }

    /**
     * Overrides addText and adds polly voice tags if a polly voice has been set.
     * @param {string | string[]} text
     * @param {boolean} condition
     * @param {number} probability
     * @returns {this}
     */
    addText(text: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this {
        let ssmlText = text;
        if (AlexaSpeechBuilder.pollyVoice) {
            if (Array.isArray(text)) {
                ssmlText = `<voice name="${AlexaSpeechBuilder.pollyVoice}">${_sample(text)}</voice>`;
            } else {
                ssmlText = `<voice name="${AlexaSpeechBuilder.pollyVoice}">${text}</voice>`;
            }
        }

        return super.addText(ssmlText, condition, probability, surroundSsml);
    }
}
