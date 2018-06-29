'use strict';

const IntentRequest = require('./intentRequest').IntentRequest;

/**
 * Alexa launch request
 */
class CanFulfillIntentRequest extends IntentRequest {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }
}

module.exports.CanFulfillIntentRequest = CanFulfillIntentRequest;
