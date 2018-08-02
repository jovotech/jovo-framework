'use strict';

const _ = require('lodash');

const AlexaRequestContextAndSession = require('./alexaRequestContextAndSession').AlexaRequestContextAndSession;

/**
 * Alexa GameEngine.InputHandlerEvent request
 */
class GameEngineInputHandlerEventRequest extends AlexaRequestContextAndSession {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns originatingRequestId
     * @return {string}
     */
    getOriginatingRequestId() {
        return _.get(this, 'request.originatingRequestId');
    }

    /**
     * Returns events
     * @return {string}
     */
    getEvents() {
        return _.get(this, 'request.events');
    }
}

module.exports.GameEngineInputHandlerEventRequest = GameEngineInputHandlerEventRequest;
