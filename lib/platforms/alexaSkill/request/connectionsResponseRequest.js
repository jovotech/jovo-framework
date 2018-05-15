'use strict';

const _ = require('lodash');
const AlexaRequestContextAndSession = require('./alexaRequestContextAndSession').AlexaRequestContextAndSession;

/**
 * Alexa intent request
 */
class ConnectionsResponseRequest extends AlexaRequestContextAndSession {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns request.status object
     * @return {*}
     */
    getStatus() {
        return _.get(this, 'request.status');
    }

    /**
     * Returns request.payload object
     * @return {*}
     */
    getPayload() {
        return _.get(this, 'request.payload');
    }
}

module.exports.ConnectionsResponseRequest = ConnectionsResponseRequest;
