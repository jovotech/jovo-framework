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
    type() {
        return 'AlexaSkill';
    }

    /**
     * Launch
     * @return {RequestBuilder}
     */
    launch() {
        this._req = RequestBuilder.launchRequest();
        return this;
    }

    /**
     * AudioPlayer Directive
     * @param {object} request
     * @return {RequestBuilder}
     */
    audioPlayerRequest(request) {
        if (request && request.constructor === {}.constructor) {
            this._req = RequestBuilder.audioPlayerRequest(request);
            return this;
        }
        this._req = RequestBuilder.audioPlayerRequest();
        if (request && typeof request === 'string') {
            this.setType(`AudioPlayer.${request}`);
        }
        return this;
    }

    /**
     * Error
     * @param {object}request
     * @return {RequestBuilder}
     */
    error(request) {
        this._req = RequestBuilder.errorRequest(request);
        return this;
    }

    /**
     * Skill Event
     * @param {object} request
     * @return {RequestBuilder}
     */
    skillEventRequest(request) {
        if (request && request.constructor === {}.constructor) {
            this._req = RequestBuilder.skillEventRequest(request);
            return this;
        }
        this._req = RequestBuilder.skillEventRequest();
        if (request && typeof request === 'string') {
            this.setType(`AlexaSkillEvent.${request}`);
        }
        return this;
    }

    /**
     * Display request.
     * @param {object} request
     * @return {RequestBuilder}
     */
    displayRequest(request) {
        this._req = RequestBuilder.displayRequest(request);
        return this;
    }

    /**
     * Intent
     * @param {object}request
     * @param {object} slots
     * @return {RequestBuilder}
     */
    intent(request, slots) {
        this._req = RequestBuilder.intentRequest(request, slots);
        return this;
    }

    /**
     * end
     * @return {RequestBuilder}
     */
    end() {
        this._req = RequestBuilder.sessionEndedRequest();
        return this;
    }

    /**
     * Sets intent name
     * @param {string} intentName
     * @return {RequestBuilder}
     */
    setIntentName(intentName) {
        this._req.setIntentName(intentName);
        return this;
    }

    /**
     * Sets the type for the request.
     * @param {string} type
     * @return {RequestBuilder}
     */
    setType(type) {
        this._req.setType(type);
        return this;
    }

    /**
     * Sets newSession
     * @param {boolean} isNewSession
     * @return {RequestBuilder}
     */
    setSessionNew(isNewSession) {
        this._req.setSessionNew(isNewSession);
        return this;
    }

    /**
     * Sets state
     * @param {string} state
     * @return {RequestBuilder}
     */
    setState(state) {
        this._req.setState(state);
        return this;
    }

    /**
     * Adds session attribute
     * @param {string} key
     * @param {string} value
     * @return {RequestBuilder}
     */
    setSessionAttribute(key, value) {
        this._req.setSessionAttribute(key, value);
        return this;
    }

    /**
     * Adds a whole object of session attributes.
     * @param {object} sessionAttributes
     * @return {RequestBuilder}
     */
    setSessionAttributes(sessionAttributes) {
        for (let sessionAttribute in sessionAttributes) {
            if (sessionAttributes.hasOwnProperty(sessionAttribute)) {
                this.setSessionAttribute(sessionAttribute, sessionAttributes[sessionAttribute]);
            }
        }
        return this;
    }

    /**
     * Checks if request has session attributes.
     * @return {boolean}
     */
    hasSessionAttributes() {
        return this._req.getSessionAttributes() !== undefined &&
            Object.keys(this._req.getSessionAttributes()).length > 0;
    }

    /**
     * Add input to request object
     * @param {string} name
     * @param {*} value
     * @return {*}
     */
    addInput(name, value) {
        return this.addSlot(name, value);
    }

    /**
     * Add slot to request object
     * @param {string} name
     * @param {*} value
     * @return {*}
     */
    addSlot(name, value) {
        this._req.addSlot(name, value);
        return this;
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {RequestBuilder}
     */
    setUserId(userId) {
        this._req.setUserId(userId);
        return this;
    }

    /**
     * Gets user id
     * @return {RequestBuilder}
     */
    getUserId() {
        return this._req.getUserId();
    }

    /**
     * Checks, if session is new.
     * @return {*|boolean}
     */
    getSessionNew() {
        return this._req.getSessionNew();
    }

    /**
     * Creates full http request object
     * @return {*}
     */
    buildHttpRequest() {
        return this._req.buildHttpRequest();
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
     * Intent Request
     * @param {object|string} request
     * @param {object} slots
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
                    json.addSlot(slot, slots[slot]);
                }
            }
            return json;
        } else if (request.constructor === {}.constructor) {
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
module.exports.launchRequest = RequestBuilder.launchRequest;
module.exports.intentRequest = RequestBuilder.intentRequest;
module.exports.sessionEndedRequest = RequestBuilder.sessionEndedRequest;
module.exports.audioPlayerRequest = RequestBuilder.audioPlayerRequest;
module.exports.errorRequest = RequestBuilder.errorRequest;
module.exports.skillEventRequest = RequestBuilder.skillEventRequest;
module.exports.displayRequest = RequestBuilder.displayRequest;
