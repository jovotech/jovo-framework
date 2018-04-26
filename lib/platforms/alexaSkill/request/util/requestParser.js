'use strict';
const LaunchRequest = require('../launchRequest').LaunchRequest;
const IntentRequest = require('../intentRequest').IntentRequest;
const SessionEndedRequest = require('../sessionEndedRequest').SessionEndedRequest;
const ErrorRequest = require('../errorRequest').ErrorRequest;
const AudioPlayerRequest = require('../audioPlayerRequest').AudioPlayerRequest;
const DisplayRequest = require('../displayRequest').DisplayRequest;
const EventRequest = require('../eventRequest').EventRequest;

const AlexaRequest = require('../alexaRequest').AlexaRequest;
const AlexaRequestContext = require('../alexaRequestContext').AlexaRequestContext;
const AlexaRequestContextAndSession = require('../alexaRequestContextAndSession').AlexaRequestContextAndSession;


const _ = require('lodash');

/**
 * RequestParser Class
 */
class RequestParser {
    /**
     * Parses the incoming request and creates specific request object.
     * @param {object} request
     * @return {*}
     */
    static createRequest(request) {
        const type = _.get(request, 'request.type');
        if (!type) {
            return null;
        }

        if (type === 'LaunchRequest') {
            return new LaunchRequest(request);
        } else if (type === 'IntentRequest') {
            return new IntentRequest(request);
        } else if (type === 'SessionEndedRequest') {
            return new SessionEndedRequest(request);
        } else if (type === 'System.ExceptionEncountered') {
            return new ErrorRequest(request);
        } else if (type.substring(0, 11) === 'AudioPlayer') {
            return new AudioPlayerRequest(request);
        } else if (type.substring(0, 7) === 'Display') {
            return new DisplayRequest(request);
        } else if (type.substring(0, 15) === 'AlexaSkillEvent') {
            return new EventRequest(request);
        } else if (type.substring(0, 23) === 'AlexaHouseholdListEvent') {
            return new EventRequest(request);
        } else {
            if (_.get(request, 'session') && _.get(request, 'context')) {
                return new AlexaRequestContextAndSession(request);
            } else if (!_.get(request, 'session') && _.get(request, 'context')) {
                return new AlexaRequestContext(request);
            } else {
                return new AlexaRequest(request);
            }
        }
    }
}

module.exports.RequestParser = RequestParser;
