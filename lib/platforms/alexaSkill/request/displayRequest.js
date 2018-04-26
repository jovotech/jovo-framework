'use strict';

const _ = require('lodash');
const AlexaRequestContextAndSession = require('./alexaRequestContextAndSession').AlexaRequestContextAndSession;

/**
 * Alexa display request class.
 */
class DisplayRequest extends AlexaRequestContextAndSession {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns request token
     * @return {string}
     */
    getToken() {
        return _.get(this, 'context.Display.token',
            _.get(this, 'request.token'));
    }

    /**
     * Returns request token
     * @return {string}
     */
    getRequestToken() {
        return _.get(this, 'request.token');
    }

    /**
     * Sets request token;
     * @param {string} token
     * @return {DisplayRequest}
     */
    setRequestToken(token) {
        _.set(this, 'request.token', token);
        return this;
    }
    /**
     * Sets request token;
     * @param {string} token
     * @return {DisplayRequest}
     */
    setToken(token) {
        _.set(this, 'request.token', token);
        _.set(this, 'context.Display.token', token);
        return this;
    }
}

module.exports.DisplayRequest = DisplayRequest;
