'use strict';
const DialogFlowRequest = require('../dialogFlowRequest').DialogFlowRequest;
const GoogleActionRequest = require('../googleActionRequest').GoogleActionRequest;
const GoogleActionDialogFlowRequest = require('../googleActionDialogFlowRequest').GoogleActionDialogFlowRequest;

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
        } else {
            return new GoogleActionRequest(request);
        }
    }
}

module.exports.RequestParser = RequestParser;
