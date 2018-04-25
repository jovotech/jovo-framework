'use strict';
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
    intent() {
        this._req = RequestBuilder.intentRequest();
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
     * Sets newSession
     * @param {boolean} isNewSession
     * @return {RequestBuilder}
     */
    setSessionNew(isNewSession) {
        this._req.getGoogleActionRequest().setSessionNew(isNewSession);
        return this;
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
    static intentRequest(request) {
        if (request) {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest)(
                JSON.parse(JSON.stringify(intentRequestSample))
            );
        }
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
