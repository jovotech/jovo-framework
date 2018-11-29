import * as _ from 'lodash';
import {SpeechBuilder} from "jovo-core";
import {AlexaSkill} from "./AlexaSkill";


export class AlexaSpeechBuilder extends SpeechBuilder {
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
    addAudio(url: string | string[], condition?: boolean, probability?: number) {
        if (_.isArray(url)) {
            return this.addText('<audio src="' + _.sample(url)  + '"/>', condition, probability);
        }
        return this.addText('<audio src="' + url  + '"/>', condition, probability);
    }
}
