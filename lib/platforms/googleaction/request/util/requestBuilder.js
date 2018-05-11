'use strict';

const IntentRequest = require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest;

const intentRequestSample = require('../samples/dialogflow/intentSample');
const launchRequestSample = require('../samples/dialogflow/google_assistant_welcome_sample');
const stopIntentSample = require('../samples/dialogflow/stopIntentSample');
const permissionGrantedRequestSample = require('../samples/actions/permissionGrantedNameRequest');
const permissionNotGrantedRequestSample = require('../samples/actions/permissionNotGrantedRequest');


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
        return 'GoogleActionDialogFlow';
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
     * Intent
     * @return {RequestBuilder}
     */
    intent(request, params) {
        this._req = RequestBuilder.intentRequest(request, params);
        return this;
    }

    /**
     * end
     * @return {RequestBuilder}
     */
    end() {
        this._req = RequestBuilder.endRequest();
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
     * Adds session attribute
     * @param {string} key
     * @param {string} value
     * @return {RequestBuilder}
     */
    setSessionAttribute(key, value) {
        let sessionContext = this._req.getContext('session');
        if (!sessionContext) {
            this._req.setContext({
                name: 'session',
                lifespan: 1000,
                parameters: {
                    [key]: value,
                },
            });
        } else {
            sessionContext.parameters[key] = value;
        }
        return this;
    }

    /**
     * Add a whole object of session attributes.
     * @param sessionAttributes
     * @returns {RequestBuilder}
     */
    setSessionAttributes(sessionAttributes) {
        for (let sessionAttribute in sessionAttributes) {
            if (sessionAttributes.hasOwnProperty(sessionAttribute)) {
                this.setSessionAttribute(
                    sessionAttribute, sessionAttributes[sessionAttribute]
                );
            }
        }
        return this;
    }

    /**
     * Sets newSession
     * @param {boolean} isNewSession
     * @return {RequestBuilder}
     */
    setSessionNew(isNewSession) {
        this._req.getGoogleActionRequest().setSessionNew(isNewSession);
        return this;
    }

    /**
     * Check if session is new.
     * @returns {boolean}
     */
    getSessionNew() {
        return this._req.getGoogleActionRequest().getSessionNew();
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {RequestBuilder}
     */
    setUserId(userId) {
        this._req.getGoogleActionRequest().setUserId(userId);
        return this;
    }

    /**
     * Gets user id
     * @returns {RequestBuilder}
     */
    getUserId() {
        return this._req.getGoogleActionRequest().getUserId();
    }

    /**
     * Sets state
     * @param {string} state
     * @return {RequestBuilder}
     */
    setState(state) {
        let sessionContext = this._req.getContext('session');
        if (!sessionContext) {
            this._req.setContext({
                name: 'session',
                lifespan: 100,
                parameters: {
                    STATE: state,
                },
            });
        } else {
            sessionContext.parameters.STATE = state;
        }
        return this;
    }

    /**
     * Add parameter to request object
     * @param {string} name
     * @param {*} value
     * @return {*}
     */
    addParameter(name, value) {
        this._req.addParameter(name, value);
        return this;
    }

    /**
     * Add input to request object
     * @param {string} name
     * @param {*} value
     * @return {*}
     */
    addInput(name, value) {
        return this.addParameter(name, value);
    }

    /**
     * Creates full http request object
     * @return {*}
     */
    buildHttpRequest() {
        delete this._req.request;
        return this._req.buildHttpRequest();
    }

    /**
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static intentRequest(request, params) {
        if (!request) {
            return new IntentRequest(JSON.parse(JSON.stringify(intentRequestSample)));
        }
        if (typeof request === 'string') {
            let json = new IntentRequest(JSON.parse(JSON.stringify(intentRequestSample)));
            json.setIntentName(request);
            if (params) {
                for (let p in params) {
                    json.addParameter(p, params[p]);
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
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static launchRequest(request) {
        if (request) {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(
                JSON.parse(JSON.stringify(launchRequestSample))
            );
        }
    }

    // TODO deprecated?
    /**
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static request(request) {
        if (request) {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(JSON.parse(JSON.stringify(request)));
        }
    }

    /**
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static endRequest(request) {
        if (request) {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(
                JSON.parse(JSON.stringify(stopIntentSample))
            );
        }
    }

    /**
     * Creates intent request
     * @param {*} request
     * @param {boolean} granted
     * @return {GoogleActionDialogFlowRequest}
     */
    static permissionRequest(request, granted) {
        if (request) {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(JSON.parse(JSON.stringify(request)));
        } else {
            if (granted) {
                return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(
                    JSON.parse(JSON.stringify(permissionGrantedRequestSample))
                );
            } else {
                return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(
                    JSON.parse(JSON.stringify(permissionNotGrantedRequestSample))
                );
            }
        }
    }
}


module.exports.RequestBuilder = RequestBuilder;
module.exports.launchRequest = RequestBuilder.launchRequest;
module.exports.intentRequest = RequestBuilder.intentRequest;
module.exports.endRequest = RequestBuilder.endRequest;
module.exports.permissionRequest = RequestBuilder.permissionRequest;
