'use strict';
const intentRequestSample = require('../samples/googleActionDialogflow/v2/intentSample');
const launchRequestSample = require('../samples/googleActionDialogflow/v2/google_assistant_welcome_sample');
const stopIntentSample = require('../samples/googleActionDialogflow/v2/stopIntentSample');


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
        return 'GoogleActionDialogFlowV2';
    }

    /**
     * Launch
     * @return {RequestBuilder}
     */
    static launch() {
        return RequestBuilder.launchRequest();
    }

    /**
     * Intent
     * @return {RequestBuilder}
     */
    static intent() {
        return RequestBuilder.intentRequest();
    }

    /**
     * end
     * @return {RequestBuilder}
     */
    static end() {
        return RequestBuilder.endRequest();
    }


    /**
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static intentRequest(request) {
        if (request) {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(
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
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(
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
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(request)));
        }
    }

    /**
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static endRequest(request) {
        if (request) {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(
                JSON.parse(JSON.stringify(stopIntentSample))
            );
        }
    }

}


module.exports.RequestBuilder = RequestBuilder;
