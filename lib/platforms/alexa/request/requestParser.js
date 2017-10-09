
const LaunchRequest = require('./launchRequest').LaunchRequest;
const IntentRequest = require('./intentRequest').IntentRequest;
const SessionEndedRequest = require('./sessionEndedRequest').SessionEndedRequest;


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
        if (request.request.type === 'LaunchRequest') {
            return new LaunchRequest(request);
        } else if (request.request.type === 'IntentRequest') {
            return new IntentRequest(request);
        } else if (request.request.type === 'SessionEndedRequest') {
            return new SessionEndedRequest(request);
        }
    }
}

module.exports.RequestParser = RequestParser;
