import { SpeechBuilder } from 'jovo-core';
import { GoogleAction } from './GoogleAction';
export declare class GoogleActionSpeechBuilder extends SpeechBuilder {
    constructor(googleAction: GoogleAction);
    addAudio(url: string | string[], textOrConditionOrProbability?: string | string[] | boolean | number): this;
    addAudio(url: string | string[], text?: string | string[], conditionOrProbability?: boolean | number): this;
    addAudio(url: string | string[], condition?: boolean, probability?: number): this;
    addAudio(url: string | string[], text?: string | string[], condition?: boolean, probability?: number): this;
    addPhoneme(text: string, ph: string, alphabet: string): this;
}
