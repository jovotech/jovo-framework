import { Plugin } from 'jovo-core';
import { AlexaSkill } from '../core/AlexaSkill';
import { Alexa } from '../Alexa';
import { AlexaSpeechBuilder } from '../core/AlexaSpeechBuilder';
export declare class GadgetController {
    alexaSkill: AlexaSkill;
    animations?: any[];
    triggerEvent?: string;
    constructor(alexaSkill: AlexaSkill);
    /**
     * Sets animations
     * @param {array} animationArray
     * @return {GadgetController}
     */
    setAnimations(animationArray: any[]): this;
    /**
     * Sets triggerEvent to buttonDown
     * @return {GadgetController}
     */
    setButtonDownTriggerEvent(): this;
    /**
     * Sets triggerEvent to buttonUp
     * @return {GadgetController}
     */
    setButtonUpTriggerEvent(): this;
    /**
     * Sets triggerEvent to none
     * @return {GadgetController}
     */
    setNoneTriggerEvent(): this;
    /**
     * Checks if triggerEvent is one of the possible values
     * Throws error if not
     * @param {string} triggerEvent Either 'buttonDown', 'buttonUp' or 'none'
     * @return {GadgetController}
     */
    setTriggerEvent(triggerEvent: string): this;
    /**
     * Gets AnimationsBuilder instance
     * @return {AnimationsBuilder}
     */
    getAnimationsBuilder(): AnimationsBuilder;
    /**
     * Gets SequenceBuilder instance
     * @return {SequenceBuilder}
     */
    getSequenceBuilder(): SequenceBuilder;
    /**
     * Sends GadgetController.StartInputHandler directive
     * @param {array} targetGadgets ids that will receive the command
     * @param {number} triggerEventTimeMs delay in milliseconds. Minimum: 0. Maximum: 65,535.
     * @param {string} triggerEvent Either 'buttonDown', 'buttonUp' or 'none'
     * @param {array} animations one or more animations.
     */
    setLight(targetGadgets: any[], // tslint:disable-line
    triggerEventTimeMs: number, triggerEvent?: string, animations?: any[]): void;
    /**
     * Delete 'shouldEndSession' attribute, add speech text and send response
     * @param {speechBuilder|string} speech speechBuilder object whose speech attribute will be used
     */
    respond(speech: string | AlexaSpeechBuilder): void;
}
export declare class GadgetControllerPlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): void;
}
/**
 * Class AnimationsBuilder
 */
declare class AnimationsBuilder {
    animation: any;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets repeat
     * @param {number} repeat number of times to play this animation. Minimum: 0. Maximum: 255.
     * @return {AnimationsBuilder}
     */
    repeat(repeat: number): this;
    /**
     * Sets targetLights
     * @param {array} targetLights
     * @return {AnimationsBuilder}
     */
    targetLights(targetLights: string[]): this;
    /**
     * Sets sequence
     * @param {array} sequence steps to render in order
     * @return {AnimationsBuilder}
     */
    sequence(sequence: any[]): this;
    /**
     * Returns events object
     * @public
     * @return {object}
     */
    build(): any;
}
/**
 * Class SequenceBuilder
 */
declare class SequenceBuilder {
    sequence: any;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets durationMs
     * @param {number} durationMs in milliseconds to render this step. Minimum: 1. Maximum: 65,535.
     * @return {SequenceBuilder}
     */
    duration(durationMs: number): this;
    /**
     * Sets color
     * @param {string} color
     * @return {SequenceBuilder}
     */
    color(color: string): this;
    /**
     * Sets blend
     * @param {boolean} blend
     * @return {SequenceBuilder}
     */
    blend(blend: boolean): this;
    /**
     * Returns events object
     * @public
     * @return {object}
     */
    build(): any;
}
export {};
