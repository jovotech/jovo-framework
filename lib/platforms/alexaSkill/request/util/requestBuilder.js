'use strict';

const AlexaRequest = require('../alexaRequest').AlexaRequest;

const LaunchRequest = require('../launchRequest').LaunchRequest;
const IntentRequest = require('../intentRequest').IntentRequest;
const SessionEndedRequest = require('../sessionEndedRequest').SessionEndedRequest;
const AudioPlayerRequest = require('../audioPlayerRequest').AudioPlayerRequest;
const ErrorRequest = require('../errorRequest').ErrorRequest;
const EventRequest = require('../eventRequest').EventRequest;
const DisplayRequest = require('../displayRequest').DisplayRequest;

const launchRequestSample = require('../samples/launchRequestSample.json');
const intentRequestSample = require('../samples/intentRequestSample.json');
const sessionEndedRequestSample = require('../samples/sessionEndedRequestSample.json');
const audioPlayerRequestSample = require('../samples/audioPlayerRequestSample1.json');
const errorRequestSample = require('../samples/errorRequestSample.json');
const skillEventRequestSample = require('../samples/skillEventRequest.json');
const displayElementRequestSample = require('../samples/displayElementSelectedRequest.json');

/**
 * Initializes request objects
 * WORK IN PROGRESS
 */
class RequestBuilder {

    /**
     * Type of request
     * @return {string}
     */
    static type() {
        return 'AlexaSkill';
    }

    /**
     * Launch
     * @param {object|string} request
     * @return {LaunchRequest}
     */
    static launch(request) {
        return RequestBuilder.launchRequest();
    }

    /**
     * Intent request
     * @param {*} name
     * @param {*} slots
     * @return {IntentRequest}
     */
    static intent(name, slots) {
        return RequestBuilder.intentRequest(name, slots);
    }

    /**
     * End
     * @param {object|string} request
     * @return {SessionEndedRequest}
     */
    static end(request) {
        return RequestBuilder.sessionEndedRequest();
    }

    /**
     * Returns Request instance
     * @param {Object} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static request(request) {
        return require('./../../../../util').makeRequestInstance(request);
    }

    /**
     * Initializes launch request
     * @param {*} request
     * @return {LaunchRequest}
     */
    static alexaRequest(request) {
        if (request) {
            return new AlexaRequest(JSON.parse(JSON.stringify(request)));
        }
    }

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
     * @param {*} slots
     * @return {IntentRequest}
     */
    static intentRequest(request, slots) {
        if (!request) {
            return new IntentRequest(JSON.parse(JSON.stringify(intentRequestSample)));
        }

        if (typeof request === 'string') {
            let json = new IntentRequest(JSON.parse(JSON.stringify(intentRequestSample)));
            json.setIntentName(request);
            if (slots) {
                for (let slot in slots) {
                    if (slots.hasOwnProperty(slot)) {
                        json.addSlot(slot, slots[slot]);
                    }
                }
            }
            return json;
        }

        if (request.constructor === {}.constructor) {
            return new IntentRequest(JSON.parse(JSON.stringify(request)));
        }
        return new IntentRequest(JSON.parse(JSON.stringify(intentRequestSample)));
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
        if (!request) {
            return new AudioPlayerRequest(JSON.parse(JSON.stringify(audioPlayerRequestSample)));
        }
        if (request.constructor === {}.constructor) {
            return new AudioPlayerRequest(JSON.parse(JSON.stringify(request)));
        }
        if (typeof request === 'string') {
            return new AudioPlayerRequest(JSON.parse(JSON.stringify(audioPlayerRequestSample)))
                .setType(request);
        }

        return new AudioPlayerRequest(JSON.parse(JSON.stringify(audioPlayerRequestSample)));
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

    /**
     * Initializes error request
     * @param {*} request
     * @return {ErrorRequest}
     */
    static skillEventRequest(request) {
        if (request) {
            return new EventRequest(JSON.parse(JSON.stringify(request)));
        } else {
            return new EventRequest(JSON.parse(JSON.stringify(skillEventRequestSample)));
        }
    }

    /**
     * Initializes error request
     * @param {*} request
     * @return {ErrorRequest}
     */
    static displayRequest(request) {
        if (request) {
            return new DisplayRequest(JSON.parse(JSON.stringify(request)));
        } else {
            return new DisplayRequest(JSON.parse(JSON.stringify(displayElementRequestSample)));
        }
    }
}


module.exports.RequestBuilder = RequestBuilder;
