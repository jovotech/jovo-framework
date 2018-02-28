'use strict';
const intentRequestSample = require('../samples/dialogflow/intentSample.json');


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
     */
    launch() {
        this._req = RequestBuilder.launchRequest();
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
     * Sets intent name
     * @param {string} intentName
     * @return {RequestBuilder}
     */
    setIntentName(intentName) {
        this._req.setIntentName(intentName);
        return this;
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
}


module.exports.RequestBuilder = RequestBuilder;
