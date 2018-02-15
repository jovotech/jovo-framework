'use strict';

const _ = require('lodash');
const AlexaRequestContextAndSession = require('./alexaRequestContextAndSession').AlexaRequestContextAndSession;

/**
 * Alexa session ended request
 */
class SessionEndedRequest extends AlexaRequestContextAndSession {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns ended reason
     * @return {string} reason
     */
    getReason() {
        return _.get(this, 'request.reason');
    }

    /**
     * Returns error object
     * @return {*}
     */
    getError() {
        return _.get(this, 'request.error');
    }

    /**
     * Sets end reason
     * @param {'USER_INITIATED'|'ERROR'|'EXCEEDED_MAX_REPROMPTS'} reason
     * @return {SessionEndedRequest}
     */
    setReason(reason) {
        _.set(this, 'request.reason', reason);
        return this;
    }

    /**
     * Sets error object
     * @param {*} error
     * @return {SessionEndedRequest}
     */
    setError(error) {
        _.set(this, 'request.error', error);
        return this;
    }
}

module.exports.SessionEndedRequest = SessionEndedRequest;
