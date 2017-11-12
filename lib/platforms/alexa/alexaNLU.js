'use strict';

const NLUBase = require('./../NLUBase').NLUBase;

/**
 * AlexaNLU class
 */
class AlexaNLU extends NLUBase {
    /**
     * Constructor
     * @param {*} request
     */
    constructor(request) {
        super();
        this.request = request;
    }

    /**
     * Does nothing, NLU is integrated in
     * Alexa requests
     * @public
     * @param {String} rawText
     */
    execute(rawText) {
    }

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return this.request.getIntentName();
    }

    /**
     * Returns slots
     * @return {*}
     */
    getInputs() {
        let inputs = {};

        if (!this.request.getSlots()) {
            return inputs;
        }

        let slotNames = Object.keys(this.request.getSlots());

        for (let i = 0; i < slotNames.length; i++) {
            let key = slotNames[i];
            inputs[key] = this.request.getSlots()[key].value;
        }

        return inputs;
    }

}

module.exports.AlexaNLU = AlexaNLU;

