import {Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";
import _get = require('lodash.get');
import _set = require('lodash.set');
import {AlexaRequest, Intent} from "../core/AlexaRequest";
import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaSpeechBuilder} from "../core/AlexaSpeechBuilder";
import {AlexaResponse} from "../index";
import { DynamicEntityType } from '../core/AlexaResponse';

export class DialogInterface implements Plugin {
    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));
        alexa.middleware('$output')!.use(this.output.bind(this));

        AlexaSkill.prototype.$dialog = undefined;

        AlexaSkill.prototype.dialog = function() {
            return this.$dialog;
        };

        /**
         * Clears temporary dynamic entities
         */
        AlexaSkill.prototype.clearDynamicEntities = function() {
            if (!this.$output.Alexa) {
                this.$output.Alexa = {};
            }

            if (!this.$output.Alexa.Directives) {
                this.$output.Alexa.Directives = [];
            }

            this.$output.Alexa.Directives.push({
                type: 'Dialog.UpdateDynamicEntities',
                updateBehavior: 'CLEAR'
            });
            return this;
        };


        /**
         * Replaces dynamic entities for the session
         * @param dynamicEntityTypes
         */
        AlexaSkill.prototype.replaceDynamicEntities = function(dynamicEntityTypes: DynamicEntityType[] | DynamicEntityType) {
            if (!this.$output.Alexa) {
                this.$output.Alexa = {};
            }

            if (!this.$output.Alexa.Directives) {
                this.$output.Alexa.Directives = [];
            }

            if (!Array.isArray(dynamicEntityTypes)) {
                dynamicEntityTypes = [dynamicEntityTypes];
            }

            this.$output.Alexa.Directives.push({
                type: 'Dialog.UpdateDynamicEntities',
                updateBehavior: 'REPLACE',
                types: dynamicEntityTypes
            });
            return this;
        };

        // backwards compatibility deprecated methods


        /**
         * Returns Intent Confirmation status
         * @deprecated Please use this.$alexaSkill.$dialog.getIntentConfirmationStatus();
         * @return {String}
         */
        AlexaSkill.prototype.getIntentConfirmationStatus = function() {
            return this.$dialog!.getIntentConfirmationStatus();
        };

        /**
         * Returns slot confirmation status
         * @public
         * @param {string} slotName
         * @return {*}
         */
        AlexaSkill.prototype.getSlotConfirmationStatus = function(slotName: string) {
            return this.$dialog!.getSlotConfirmationStatus(slotName);
        };

        /**
         * Returns state of dialog
         * @deprecated Please use this.$alexaSkill.$dialog.getState();
         * @return {String}
         */
        AlexaSkill.prototype.getDialogState = function() {
            return this.$dialog!.getState();
        };

        /**
         * Returns true if dialog is in state COMPLETED
         * @deprecated Please use this.$alexaSkill.$dialog.isCompleted();
         * @return {boolean}
         */
        AlexaSkill.prototype.isDialogCompleted = function() {
            return this.$dialog!.isCompleted();
        };

        /**
         * Returns true if dialog is in state IN_PROGRESS
         * @deprecated Please use this.$alexaSkill.$dialog.isInProgress();
         * @return {boolean}
         */
        AlexaSkill.prototype.isDialogInProgress = function() {
            return this.$dialog!.isInProgress();
        };


        /**
         * Returns true if dialog is in state STARTED
         * @deprecated Please use this.$alexaSkill.$dialog.isStarted();
         * @return {boolean}
         */
        AlexaSkill.prototype.isDialogStarted = function() {
            return this.$dialog!.hasStarted();
        };


        /**
         * Returns if slot is confirmed
         * @deprecated Please use this.$alexaSkill.$dialog.isSlotConfirmed();
         * @return {boolean}
         */
        AlexaSkill.prototype.isSlotConfirmed = function(slotName: string) {
            return this.$dialog!.isSlotConfirmed(slotName);
        };


        /**
         * Returns if slot is confirmed
         * @deprecated Please use this.$alexaSkill.$dialog.hasSlotValue(slotName);
         * @return {boolean}
         */
        AlexaSkill.prototype.hasSlotValue = function(slotName: string) {
            return this.$dialog!.hasSlotValue(slotName);
        };


        /**
         * Creates delegate directive. Alexa handles next dialog
         * step
         * @deprecated Please use this.$alexaSkill.$dialog.delegate(updatedIntent);
         * @param {Intent} updatedIntent
         * @return {AlexaResponse}
         */
        AlexaSkill.prototype.dialogDelegate = function(updatedIntent?: Intent) {
            return this.$dialog!.delegate(updatedIntent);
        };


        /**
         * Let alexa ask user for the value of a specific slot
         * @deprecated Please use this.$alexaSkill.$dialog.elicitSlot(slotToElicit, speech, reprompt, updatedIntent);
         * @param {string} slotToElicit name of the slot
         * @param {string} speech
         * @param {string} reprompt
         * @param {Intent} updatedIntent
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.dialogElicitSlot = function(slotToElicit: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent) {
            return this.$dialog!.elicitSlot(slotToElicit, speech, reprompt, updatedIntent);
        };


        /**
         * Let alexa ask user to confirm slot with yes or no
         * @deprecated Please use this.$alexaSkill.$dialog.confirmSlot(slotToConfirm, speech, reprompt, updatedIntent);
         * @param {string} slotToConfirm name of the slot
         * @param {string} speech
         * @param {string} reprompt
         * @param {Intent} updatedIntent
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.dialogConfirmSlot = function(slotToConfirm: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent) {
            return this.$dialog!.confirmSlot(slotToConfirm, speech, reprompt, updatedIntent);
        };


        /**
         * Asks for intent confirmation
         * @deprecated Please use this.$alexaSkill.$dialog.confirmIntent(speech, reprompt, updatedIntent);
         * @param {string} speech
         * @param {string} reprompt
         * @param {Intent} updatedIntent
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.dialogConfirmIntent = function(speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent) {
            return this.$dialog!.confirmIntent(speech, reprompt, updatedIntent);
        };

    }
    uninstall(alexa: Alexa) {
    }

    type(alexaSkill: AlexaSkill) {
        alexaSkill.$dialog = new Dialog(alexaSkill);
    }

    private output(alexaSkill: AlexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new AlexaResponse();
        }
        if (_get(output, 'Alexa.Dialog')) {
            _set(alexaSkill.$response, 'response.shouldEndSession', false);
            _set(alexaSkill.$response, 'response.directives',
                [_get(output, 'Alexa.Dialog')]
            );
        }
    }
}

export class Dialog {
    alexaSkill: AlexaSkill;
    alexaRequest: AlexaRequest;

    constructor(alexaSkill: AlexaSkill) {
        this.alexaSkill = alexaSkill;
        this.alexaRequest = alexaSkill.$request as AlexaRequest;

    }

    /**
     * Returns state of dialog
     * @public
     * @return {string}
     */
    getState() {
        return _get(this.alexaRequest, 'request.dialogState');
    }


    /**
     * Returns true if dialog is in state COMPLETED
     * @public
     * @return {boolean}
     */
    isCompleted() {
        return this.getState() === 'COMPLETED';
    }


    /**
     * Returns true if dialog is in state IN_PROGRESS
     * @public
     * @return {boolean}
     */
    isInProgress() {
        return this.getState() === 'IN_PROGRESS';
    }


    /**
     * Returns true if dialog is in state STARTED
     * @public
     * @return {boolean}
     */
    isStarted() {
        return this.getState() === 'STARTED';
    }

    /**
     * Returns true if dialog is in state STARTED
     * @public
     * @return {boolean}
     */
    hasStarted() {
        return this.isStarted();
    }

    /**
     * Creates delegate directive. Alexa handles next dialog
     * step
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    delegate(updatedIntent?: Intent) {
        _set(this.alexaSkill.$output, 'Alexa.Dialog',
            new DialogDelegateDirective(updatedIntent)
        );
        return this.alexaSkill;
    }

    /**
     * Let alexa ask user for the value of a specific slot
     * @public
     * @param {string} slotToElicit name of the slot
     * @param {string} speech
     * @param {string} reprompt
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    elicitSlot(slotToElicit: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent) {
        this.alexaSkill.ask(speech, reprompt);

        _set(this.alexaSkill.$output, 'Alexa.Dialog',
            new DialogElicitSlotDirective(slotToElicit, updatedIntent)
        );
        return this.alexaSkill;
    }

    /**
     * Let alexa ask user to confirm slot with yes or no
     * @public
     * @param {string} slotToConfirm name of the slot
     * @param {string} speech
     * @param {string} reprompt
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    confirmSlot(slotToConfirm: string, speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent) {
        this.alexaSkill.ask(speech, reprompt);
        _set(this.alexaSkill.$output, 'Alexa.Dialog',
            new DialogConfirmSlotDirective(slotToConfirm, updatedIntent)
        );
        return this.alexaSkill;
    }

    /**
     * Asks for intent confirmation
     * @public
     * @param {string} speech
     * @param {string} reprompt
     * @param {Intent} updatedIntent
     * @return {AlexaSkill}
     */
    confirmIntent(speech: string | AlexaSpeechBuilder, reprompt: string | AlexaSpeechBuilder, updatedIntent?: Intent) {
        this.alexaSkill.ask(speech, reprompt);

        _set(this.alexaSkill.$output, 'Alexa.Dialog',
            new DialogConfirmIntentDirective(updatedIntent)
        );
        return this.alexaSkill;
    }


    /**
     * Returns slot confirmation status
     * @public
     * @param {string} slotName
     * @return {*}
     */
    getSlotConfirmationStatus(slotName: string) {
        return _get(this.alexaRequest, `request.intent.slots.${slotName}.confirmationStatus`);

    }

    /**
     * Returns Intent Confirmation status
     * @public
     * @return {String}
     */
    getIntentConfirmationStatus(): string {
        return _get(this.alexaRequest, 'request.intent.confirmationStatus');
    }


    /**
     * Returns if slot is confirmed
     * @public
     * @param {string} slotName
     * @return {boolean}
     */
    isSlotConfirmed(slotName: string): boolean {
        return this.getSlotConfirmationStatus(slotName) === 'CONFIRMED';
    }


    /**
     * Checks if slot has value
     * @public
     * @return {boolean}
     */
    hasSlotValue(slotName: string) {
        return typeof _get(this.alexaRequest.getSlot(slotName), 'value') !== 'undefined';
    }

}

abstract class DialogDirective {
    type: string;
    updatedIntent?: Intent;

    constructor(type: string, updatedIntent?: Intent) {
        this.type = type;
        this.updatedIntent = updatedIntent;
    }
}
class DialogDelegateDirective extends DialogDirective {
    constructor(updatedIntent?: Intent) {
        super('Dialog.Delegate', updatedIntent);
    }
}
class DialogElicitSlotDirective extends DialogDirective {
    slotToElicit: string;
    constructor(slotToElicit: string, updatedIntent?: Intent) {
        super('Dialog.ElicitSlot', updatedIntent);
        this.slotToElicit = slotToElicit;
    }
}

class DialogConfirmSlotDirective extends DialogDirective {
    slotToConfirm: string;
    constructor(slotToConfirm: string, updatedIntent?: Intent) {
        super('Dialog.ConfirmSlot', updatedIntent);
        this.slotToConfirm = slotToConfirm;
    }
}
class DialogConfirmIntentDirective extends DialogDirective {
    constructor(updatedIntent?: Intent) {
        super('Dialog.ConfirmIntent', updatedIntent);
    }
}
