'use strict';


const LaunchRequest = require('../launchRequest').LaunchRequest;
const IntentRequest = require('../intentRequest').IntentRequest;
const SessionEndedRequest = require('../sessionEndedRequest').SessionEndedRequest;
const AudioPlayerRequest = require('../audioPlayerRequest').AudioPlayerRequest;
const ErrorRequest = require('../errorRequest').ErrorRequest;

const launchRequestSample = require('../samples/launchRequestSample.json');
const intentRequestSample = require('../samples/intentRequestSample.json');
const sessionEndedRequestSample = require('../samples/sessionEndedRequestSample.json');
const audioPlayerRequestSample = require('../samples/audioPlayerRequestSample1.json');
const errorRequestSample = require('../samples/errorRequestSample.json');


/**
 * Initializes request objects
 */
class RequestBuilder {

    /**
     * Initializes launch request
     * @param {*} request
     * @return {LaunchRequest}
     */
    static launchRequest(request) {
        if (request) {
           return new LaunchRequest(JSON.parse(JSON.stringify(request)));
        } else {
            return new LaunchRequest(JSON.parse(JSON.stringify(launchRequestSample)));
        }
    }

    /**
     * Initializes intent request
     * @param {*} request
     * @return {IntentRequest}
     */
    static intentRequest(request) {
        if (request) {
            return new IntentRequest(JSON.parse(JSON.stringify(request)));
        } else {
            return new IntentRequest(JSON.parse(JSON.stringify(intentRequestSample)));
        }
    }

    /**
     * Initializes sessionendedrequest
     * @param {*} request
     * @return {SessionEndedRequest}
     */
    static sessionEndedRequest(request) {
        if (request) {
            return new SessionEndedRequest(JSON.parse(JSON.stringify((request))));
        } else {
            return new SessionEndedRequest(JSON.parse(JSON.stringify(sessionEndedRequestSample)));
        }
    }

    /**
     * Initializes audioplayer request
     * @param {*} request
     * @return {AudioPlayerRequest}
     */
    static audioPlayerRequest(request) {
        if (request) {
            return new AudioPlayerRequest(JSON.parse(JSON.stringify(request)));
        } else {
            return new AudioPlayerRequest(JSON.parse(JSON.stringify(audioPlayerRequestSample)));
        }
    }

    /**
     * Initializes error request
     * @param {*} request
     * @return {ErrorRequest}
     */
    static errorRequest(request) {
        if (request) {
            return new ErrorRequest(JSON.parse(JSON.stringify(request)));
        } else {
            return new ErrorRequest(JSON.parse(JSON.stringify(errorRequestSample)));
        }
    }
}


module.exports.RequestBuilder = RequestBuilder;
