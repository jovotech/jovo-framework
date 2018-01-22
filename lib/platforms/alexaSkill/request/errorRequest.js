'use strict';

const _ = require('lodash');
const AlexaRequestContext = require('./alexaRequestContext').AlexaRequestContext;

/**
 * Alexa error request class
 */
class ErrorRequest extends AlexaRequestContext {
    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns error caus
     * @return {string}
     */
    getCause() {
        return _.get(this, 'request.cause');
    }

    /**
     * Returns error object
     * @return {*}
     */
    getError() {
        return _.get(this, 'request.error');
    }

    /**
     * Sets error caus
     * @param {*} cause
     * @return {ErrorRequest}
     */
    setCause(cause) {
        _.set(this, 'request.cause', cause);
        return this;
    }

    /**
     * Sets error object
     * @param {*} error
     * @return {ErrorRequest}
     */
    setError(error) {
        _.set(this, 'request.error', error);
        return this;
    }
}

module.exports.ErrorRequest = ErrorRequest;
