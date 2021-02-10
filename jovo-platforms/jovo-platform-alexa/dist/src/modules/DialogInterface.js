"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const AlexaSkill_1 = require("../core/AlexaSkill");
const index_1 = require("../index");
class DialogInterface {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.$dialog = undefined;
        AlexaSkill_1.AlexaSkill.prototype.dialog = function () {
            return this.$dialog;
        };
        /**
         * Clears temporary dynamic entities
         */
        AlexaSkill_1.AlexaSkill.prototype.clearDynamicEntities = function () {
            if (!this.$output.Alexa) {
                this.$output.Alexa = {};
            }
            if (!this.$output.Alexa.Directives) {
                this.$output.Alexa.Directives = [];
            }
            this.$output.Alexa.Directives.push({
                type: 'Dialog.UpdateDynamicEntities',
                updateBehavior: 'CLEAR',
            });
            return this;
        };
        /**
         * Adds a given array of dynamic entity types to the output object.
         */
        AlexaSkill_1.AlexaSkill.prototype.addDynamicEntityTypes = function (dynamicEntityTypes) {
            if (!this.$output.Alexa) {
                this.$output.Alexa = {};
            }
            if (!this.$output.Alexa.Directives) {
                this.$output.Alexa.Directives = [];
            }
            // ToDo: check for duplicity
            this.$output.Alexa.Directives.push({
                type: 'Dialog.UpdateDynamicEntities',
                updateBehavior: 'REPLACE',
                types: dynamicEntityTypes,
            });
            return this;
        };
        /**
         * Adds a dynamic entity to the output object.
         */
        AlexaSkill_1.AlexaSkill.prototype.addDynamicEntityType = function (dynamicEntityType) {
            return this.addDynamicEntityTypes([dynamicEntityType]);
        };
        /**
         * Replaces dynamic entities for the session
         * ToDo: Change parameter to adjust to addDynamicEntityTypes()
         * @param dynamicEntityTypes
         */
        AlexaSkill_1.AlexaSkill.prototype.replaceDynamicEntities = function (dynamicEntityTypes) {
            if (!Array.isArray(dynamicEntityTypes)) {
                dynamicEntityTypes = [dynamicEntityTypes];
            }
            return this.addDynamicEntityTypes(dynamicEntityTypes);
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        alexaSkill.$dialog = new Dialog(alexaSkill);
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new index_1.AlexaResponse();
        }
        if (_get(output, 'Alexa.Dialog')) {
            _set(alexaSkill.$response, 'response.shouldEndSession', false);
            _set(alexaSkill.$response, 'response.directives', [_get(output, 'Alexa.Dialog')]);
        }
    }
}
exports.DialogInterface = DialogInterface;
class Dialog {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
        this.alexaRequest = alexaSkill.$request;
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
    delegate(updatedIntent) {
        _set(this.alexaSkill.$output, 'Alexa.Dialog', new DialogDelegateDirective(updatedIntent));
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
    elicitSlot(slotToElicit, speech, reprompt, updatedIntent) {
        this.alexaSkill.ask(speech, reprompt);
        _set(this.alexaSkill.$output, 'Alexa.Dialog', new DialogElicitSlotDirective(slotToElicit, updatedIntent));
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
    confirmSlot(slotToConfirm, speech, reprompt, updatedIntent) {
        this.alexaSkill.ask(speech, reprompt);
        _set(this.alexaSkill.$output, 'Alexa.Dialog', new DialogConfirmSlotDirective(slotToConfirm, updatedIntent));
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
    confirmIntent(speech, reprompt, updatedIntent) {
        this.alexaSkill.ask(speech, reprompt);
        _set(this.alexaSkill.$output, 'Alexa.Dialog', new DialogConfirmIntentDirective(updatedIntent));
        return this.alexaSkill;
    }
    /**
     * Returns slot confirmation status
     * @public
     * @param {string} slotName
     * @return {*}
     */
    getSlotConfirmationStatus(slotName) {
        return _get(this.alexaRequest, `request.intent.slots.${slotName}.confirmationStatus`);
    }
    /**
     * Returns Intent Confirmation status
     * @public
     * @return {String}
     */
    getIntentConfirmationStatus() {
        return _get(this.alexaRequest, 'request.intent.confirmationStatus');
    }
    /**
     * Returns if slot is confirmed
     * @public
     * @param {string} slotName
     * @return {boolean}
     */
    isSlotConfirmed(slotName) {
        return this.getSlotConfirmationStatus(slotName) === 'CONFIRMED';
    }
    /**
     * Checks if slot has value
     * @public
     * @return {boolean}
     */
    hasSlotValue(slotName) {
        return typeof _get(this.alexaRequest.getSlot(slotName), 'value') !== 'undefined';
    }
}
exports.Dialog = Dialog;
class DialogDirective {
    constructor(type, updatedIntent) {
        this.type = type;
        this.updatedIntent = updatedIntent;
    }
}
class DialogDelegateDirective extends DialogDirective {
    constructor(updatedIntent) {
        super('Dialog.Delegate', updatedIntent);
    }
}
class DialogElicitSlotDirective extends DialogDirective {
    constructor(slotToElicit, updatedIntent) {
        super('Dialog.ElicitSlot', updatedIntent);
        this.slotToElicit = slotToElicit;
    }
}
class DialogConfirmSlotDirective extends DialogDirective {
    constructor(slotToConfirm, updatedIntent) {
        super('Dialog.ConfirmSlot', updatedIntent);
        this.slotToConfirm = slotToConfirm;
    }
}
class DialogConfirmIntentDirective extends DialogDirective {
    constructor(updatedIntent) {
        super('Dialog.ConfirmIntent', updatedIntent);
    }
}
//# sourceMappingURL=DialogInterface.js.map