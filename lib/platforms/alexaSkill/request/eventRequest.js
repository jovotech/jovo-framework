'use strict';

const _ = require('lodash');
const AlexaRequestContext = require('./alexaRequestContext').AlexaRequestContext;

/**
 * Alexa audio player request
 * Inherits from AlexaRequestContext class
 */
class EventRequest extends AlexaRequestContext {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns body element
     * @return {*}
     */
    getBody() {
        return _.get(this, 'request.body');
    }

}

module.exports.EventRequest = EventRequest;
