'use strict';

const AlexaRequestContextAndSession = require('./alexaRequestContextAndSession').AlexaRequestContextAndSession;

/**
 * Alexa launch request
 */
class LaunchRequest extends AlexaRequestContextAndSession {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }
}

module.exports.LaunchRequest = LaunchRequest;
