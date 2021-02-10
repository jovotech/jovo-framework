import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaRequest, Intent } from '../core/AlexaRequest';
import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaSpeechBuilder } from '../core/AlexaSpeechBuilder';
export declare class DialogInterface implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    private output;
}
export declare class Dialog {
    alexaSkill: AlexaSkill;
    alexaRequest: AlexaRequest;
    constructor(alexaSkill: AlexaSkill);
    /**
     * Returns state of dialog
     * @public
     * @return {string}
     */
    getState(): any;
    /**
     * Returns true if dialog is in state COMPLETED
     * @public
     * @return {boolean}
     */
    isCompleted(): boolean;
    /**
     * Returns true if dialog is in state IN_PROGRESS
     * @public
     * @return {boolean}
     */
    isInProgress(): boolean;
    /**
     * Returns true if dialog is in state STARTED
     * @public
     * @return {boolean}
     */
    isStarted(): boolean;
    /**
     * Returns true if dialog is in state STARTED
     * @public
     * @return {boolean}
     */
    hasStarted(): boolean;
    /**
     * Creates delegate directive. Alexa handles next dialog
     * step
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    delegate(updatedIntent?: Intent): AlexaSkill;
    /**
     * Let alexa ask user for the value of a specific slot
     * @public
     * @param {string} slotToElicit name of the slot
     * @param {string} speech
     * @param {string} reprompt
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    elicitSlot(slotToElicit: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent): AlexaSkill;
    /**
     * Let alexa ask user to confirm slot with yes or no
     * @public
     * @param {string} slotToConfirm name of the slot
     * @param {string} speech
     * @param {string} reprompt
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    confirmSlot(slotToConfirm: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent): AlexaSkill;
    /**
     * Asks for intent confirmation
     * @public
     * @param {string} speech
     * @param {string} reprompt
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    confirmIntent(speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent): AlexaSkill;
    /**
     * Returns slot confirmation status
     * @public
     * @param {string} slotName
     * @return {*}
     */
    getSlotConfirmationStatus(slotName: string): any;
    /**
     * Returns Intent Confirmation status
     * @public
     * @return {String}
     */
    getIntentConfirmationStatus(): string;
    /**
     * Returns if slot is confirmed
     * @public
     * @param {string} slotName
     * @return {boolean}
     */
    isSlotConfirmed(slotName: string): boolean;
    /**
     * Checks if slot has value
     * @public
     * @return {boolean}
     */
    hasSlotValue(slotName: string): boolean;
}
