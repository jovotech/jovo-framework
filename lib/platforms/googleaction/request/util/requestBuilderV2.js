'use strict';
const intentRequestSample = require('../samples/googleActionDialogflow/v2/intentSample');
const launchRequestSample = require('../samples/googleActionDialogflow/v2/google_assistant_welcome_sample');
const stopIntentSample = require('../samples/googleActionDialogflow/v2/stopIntentSample');
const mediaFinishedSample = require('../samples/googleActionDialogflow/v2/mediaFinished');


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
     * @param {*} request
     * @return {GoogleActionDialogFlowRequestV2}
     */
    static launch(request) {
        return RequestBuilder.launchRequest();
    }

    /**
     * Intent request
     * @param {*} name
     * @param {*} slots
     * @return {GoogleActionDialogFlowRequestV2}
     */
    static intent(name, slots) {
        return RequestBuilder.intentRequest(name, slots);
    }

    /**
     * end
     * @param {*} request
     * @return {GoogleActionDialogFlowRequestV2}
     */
    static end(request) {
        return RequestBuilder.endRequest();
    }

    /**
     * Intent request.
     * @param {object|string} request
     * @param {*} params
     * @return {GoogleActionDialogFlowRequest}
     */
    static intentRequest(request, params) {
        if (!request) {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(
                JSON.parse(JSON.stringify(intentRequestSample))
            );
        }
        if (typeof request === 'string') {
            let json = new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(intentRequestSample)));
            json.setIntentName(request);
            if (params) {
                for (let p in params) {
                    if (params.hasOwnProperty(p)) {
                        json.addParameter(p, params[p]);
                    }
                }
            }
            return json;
        }
        if (request.constructor === {}.constructor) {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(request)));
        }
        return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(
            JSON.parse(JSON.stringify(intentRequestSample))
        );
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

    /**
     * Creates intent request
     * @param {*} request
     * @return {GoogleActionDialogFlowRequest}
     */
    static mediaResponseFinishedRequest(request) {
        if (request) {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(JSON.parse(JSON.stringify(request)));
        } else {
            return new (require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request)(
                JSON.parse(JSON.stringify(mediaFinishedSample))
            );
        }
    }

}


module.exports.RequestBuilder = RequestBuilder;
