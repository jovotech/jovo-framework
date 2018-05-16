'use strict';
const intentRequestSample = require('../samples/googleActionDialogflow/v1/intentSample');
const launchRequestSample = require('../samples/googleActionDialogflow/v1/google_assistant_welcome_sample');
const stopIntentSample = require('../samples/googleActionDialogflow/v1/stopIntentSample');
const permissionGrantedRequestSample = require('../samples/googleActionDialogflow/v1/permissionGrantedNameRequest');
const permissionNotGrantedRequestSample = require('../samples/googleActionDialogflow/v1/permissionNotGrantedRequest');


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
        return 'GoogleActionDialogFlow';
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
