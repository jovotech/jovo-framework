'use strict';

const _ = require('lodash');
const AlexaRequestContextAndSession = require('./alexaRequestContextAndSession').AlexaRequestContextAndSession;

/**
 * Alexa intent request
 */
class IntentRequest extends AlexaRequestContextAndSession {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Adds slot to request
     * @param {string} name
     * @param {string} value
     * @return {IntentRequest}
     */
    addSlot(name, value) {
        let slotObj = {
            name: name,
            value: value,
        };
        if (!_.get(this, 'request.intent.slots')) {
            _.set(this, 'request.intent.slots', {});
        }
        _.set(this, `request.intent.slots.${name}`, slotObj);
        return this;
    }

    /**
     * Returns dialog state of request
     * @return {STARTED|IN_PROGRESS|COMPLETED}
     */
    getDialogState() {
        return _.get(this, 'request.dialogState');
    }

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return _.get(this, 'request.intent.name');
    }

    /**
     * Returns intent confirmation status
     * @return {string}
     */
    getIntentConfirmationStatus() {
        return _.get(this, 'request.intent.confirmationStatus');
    }

    /**
     * Returns slots
     * @return {*}
     */
    getSlots() {
        return _.get(this, 'request.intent.slots');
    }

    /**
     * Returns specific slot
     * @param {string} slotName
     * @return {*}
     */
    getSlot(slotName) {
        if (!this.getSlots() || !this.getSlots()[slotName]) {
            throw new Error('Could not find slot ' + slotName);
        }
        return this.getSlots()[slotName];
    }


    /**
     * Returns the confirmation status of a slot
     * @param {string} slotName
     * @return {*}
     */
    getSlotConfirmationStatus(slotName) {
        return this.getSlot(slotName).confirmationStatus;
    }

    /**
     * Sets dialog state of request
     * @param {String} dialogState
     * @return {IntentRequest} intentRequest
     */
    setDialogState(dialogState) {
        _.set(this, 'request.dialogState', dialogState);
        return this;
    }

    /**
     * Sets intent name
     * @param {string} intentName
     * @return {IntentRequest}
     */
    setIntentName(intentName) {
        _.set(this, 'request.intent.name', intentName);
        return this;
    }

    /**
     * Registers intents to skip unhandled
     * @param {string} intents
     */
    setIntentsToSkipUnhandled(intents) {
        _.set(this, 'request.intents');
    }

    /**
     * Sets intent confirmation status
     * @param {string} intentConfirmationStatus
     * @return {IntentRequest}
     */
    setIntentConfirmationStatus(intentConfirmationStatus) {
        _.set(this, 'request.intent.confirmationStatus', intentConfirmationStatus);
        return this;
    }

    /**
     * Sets slot object
     * @param {*} slots
     * @return {IntentRequest}
     */
    setSlots(slots) {
        _.set(this, 'request.intent.slots', slots);
        return this;
    }

    /**
     * Abstracted request method
     * @param {string} name
     * @param {*} value
     * @return {IntentRequest}
     */
    addInput(name, value) {
        return this.addSlot(name, value);
    }

}

module.exports.IntentRequest = IntentRequest;
