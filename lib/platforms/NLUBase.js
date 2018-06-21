'use strict';

/**
 * Base NLU case
 * No implementation, acts as an interface
 * @interface
 */
class NLUBase {

    /**
     * constructor
     * @param {*} request
     */
    constructor(request) {
        // this.request = request;
    }

    /**
     * Applies raw text to nlu engine
     * @abstract
     * @param {String} rawText
     * @param {callback} callback
     */
    execute(rawText, callback) {
    }
    /**
     * Returns intent name;
     * @abstract
     * @return {string}
     */
    getIntentName() {
    }

    /**
     * Returns array of inputs
     * @abstract
     * @return {*}
     */
    getInputs() {
    }
}

module.exports.NLUBase = NLUBase;
