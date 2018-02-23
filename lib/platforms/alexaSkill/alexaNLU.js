'use strict';

const NLUBase = require('./../NLUBase').NLUBase;
const _ = require('lodash');
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

    // /**
    //  * Returns slots
    //  * @return {*}
    //  */
    // getInputs() {
    //     let inputs = {};
    //
    //     if (!this.request.getSlots()) {
    //         return inputs;
    //     }
    //
    //     let slotNames = Object.keys(this.request.getSlots());
    //
    //     for (let i = 0; i < slotNames.length; i++) {
    //         let key = slotNames[i];
    //         inputs[key] = this.request.getSlots()[key].value;
    //     }
    //
    //     return inputs;
    // }
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
            inputs[key] = {
                'name': key,
            };

            if (this.request.getSlots()[key].value) {
                inputs[key].value = this.request.getSlots()[key].value;
                inputs[key].key = this.request.getSlots()[key].value;
            }
            if (_.get(this.request.getSlots()[key], 'resolutions.resolutionsPerAuthority[0].values[0]')) {
                inputs[key].key = _.get(this.request.getSlots()[key], 'resolutions.resolutionsPerAuthority[0].values[0]').value.name;
                inputs[key].id = _.get(this.request.getSlots()[key], 'resolutions.resolutionsPerAuthority[0].values[0]').value.id;
            }
            inputs[key].alexaSkill = this.request.getSlots()[key];
        }

        return inputs;
    }
}

module.exports.AlexaNLU = AlexaNLU;

