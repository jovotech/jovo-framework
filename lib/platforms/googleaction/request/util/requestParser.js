'use strict';
const DialogFlowRequest = require('../dialogFlowRequest').DialogFlowRequest;
const DialogFlowV2Request = require('../dialogFlowV2Request').DialogFlowV2Request;

const GoogleActionRequest = require('../googleActionRequest').GoogleActionRequest;
const GoogleActionDialogFlowRequest = require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest;
const GoogleActionDialogFlowV2Request = require('../googleActionDialogFlowV2Request').GoogleActionDialogFlowV2Request;

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
        if (_.get(request, 'originalRequest') &&
            _.get(request, 'originalRequest.source') === 'google') {
           return new GoogleActionDialogFlowRequest(request);
        } else if (_.get(request, 'result') &&
            !_.get(request, 'originalRequest')) {
            return new DialogFlowRequest(request);
        } else if (_.get(request, 'queryResult') &&
            _.get(request, 'originalDetectIntentRequest.source') === 'google') {
            return new GoogleActionDialogFlowV2Request(request);
        } else if (_.get(request, 'queryResult')) {
            return new DialogFlowV2Request(request);
        } else {
            return new GoogleActionRequest(request);
        }
    }
}

module.exports.RequestParser = RequestParser;
