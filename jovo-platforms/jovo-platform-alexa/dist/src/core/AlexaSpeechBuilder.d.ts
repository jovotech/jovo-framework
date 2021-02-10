import { SpeechBuilder } from 'jovo-core';
import { SsmlElements } from 'jovo-core/dist/src/util/SpeechBuilder';
import { AlexaSkill } from './AlexaSkill';
import { EmotionIntensity, EmotionName } from './Interfaces';
export declare class AlexaSpeechBuilder extends SpeechBuilder {
    static pollyVoice: string | undefined;
    constructor(alexaSkill: AlexaSkill);
    /**
     * Adds text with language
     * @public
     * @param {string} language
     * @param {string | string[]} text
     * @returns {SpeechBuilder}
     */
    addLangText(language: string, text: string | string[], conditionOrProbability?: boolean | number): this;
    addLangText(language: string, text: string | string[], condition?: boolean, probability?: number): this;
    /**
     * Adds text with polly
     * @public
     * @param {string} pollyName
     * @param {string | string[]} text
     * @returns {SpeechBuilder}
     */
    addTextWithPolly(pollyName: string, text: string | string[], conditionOrProbability?: boolean | number): this;
    addTextWithPolly(pollyName: string, text: string | string[], condition?: boolean, probability?: number): this;
    /**
     * Overrides addText and adds polly voice tags if a polly voice has been set.
     * @public
     * @param {string | string[]} text
     * @returns {this}
     */
    addText(text: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addText(text: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addText(text: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addText(text: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    addEmotion(name: EmotionName, intensity: EmotionIntensity, text: string | string[], conditionOrProbabilityOrSurroundSsml?: boolean | number | SsmlElements): this;
    addEmotion(name: EmotionName, intensity: EmotionIntensity, text: string | string[], condition?: boolean, probabilityOrSurroundSsml?: number | SsmlElements): this;
    addEmotion(name: EmotionName, intensity: EmotionIntensity, text: string | string[], probability?: number, surroundSsml?: SsmlElements): this;
    addEmotion(name: EmotionName, intensity: EmotionIntensity, text: string | string[], condition?: boolean, probability?: number, surroundSsml?: SsmlElements): this;
    addAudio(url: string | string[], textOrConditionOrProbability?: string | string[] | boolean | number): this;
    addAudio(url: string | string[], text?: string | string[], conditionOrProbability?: boolean | number): this;
    addAudio(url: string | string[], condition?: boolean, probability?: number): this;
    addAudio(url: string | string[], text?: string | string[], condition?: boolean, probability?: number): this;
}
