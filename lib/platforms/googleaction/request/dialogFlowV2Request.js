'use strict';

const _ = require('lodash');
const NLUBase = require('../../NLUBase').NLUBase;
const BaseApp = require('./../../../app');

/**
 * Dialogflow request
 */
class DialogFlowV2Request extends NLUBase {
    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
        if (request) {
            Object.assign(this, request);
        }
    }

    /**
     * NLU BASE Implementations
     */

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return _.get(this, 'queryResult.intent.displayName');
    }

    /**
     * Returns inputs
     * @return {*}
     */
    getInputs() {
        const params = _.get(this, 'queryResult.parameters');
        return _.mapValues(params, (value, name) => {
            return {
                name: name,
                value: value,
                key: value, // Added for cross platform consistency
                id: value, // Added for cross platform consistency
            };
        });
    }

    /**
     * Returns response id
     * @return {string}
     */
    getResponseId() {
        return _.get(this, 'responseId');
    }
    /**
     * Returns response id
     * @return {string}
     */
    getId() {
        return _.get(this, 'responseId');
    }

    /**
     * Returns timestamp
     * @return {*}
     */
    getTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Returns language code
     * @return {string}
     */
    getLanguageCode() {
        return _.get(this, 'queryResult.languageCode');
    }

    /**
     * Returs query result object
     * @return {*}
     */
    getQueryResult() {
        return _.get(this, 'queryResult');
    }


    /**
     * Returns result resolved query
     * @return {string}
     */
    getQueryText() {
        return _.get(this, 'queryResult.queryText');
    }


    /**
     * Returns result action
     * @return {string}
     */
    getAction() {
        return _.get(this, 'queryResult.action');
    }


    /**
     * Returns parameters
     * @return {*}
     */
    getParameters() {
        return _.get(this, 'queryResult.parameters');
    }

    /**
     * Returns result resolved query
     * @return {string}
     */
    getAllRequiredParamsPresent() {
        return _.get(this, 'queryResult.allRequiredParamsPresent');
    }

    /**
     * Returns result resolved query
     * @return {string}
     */
    getIntentDetectionConfidence() {
        return _.get(this, 'queryResult.intentDetectionConfidence');
    }


    /**
     * Returns contexts array
     * TODO
     * @return {Array}
     */
    getContexts() {
        return _.get(this, 'queryResult.outputContexts');
    }

    /**
     * Returns context by name
     * @param {string} name
     * @return {*}
     */
    getContext(name) {
        for (let context of this.getContexts()) {
            if (context.name === name) {
                return context;
            }
        }
    }

    /**
     * Returns intent id
     * @return {string}
     */
    getIntentId() {
        return _.get(this, 'queryResult.intent.name');
    }

    /**
     * Returns session id
     * @return {*}
     */
    getSession() {
        return _.get(this, 'session');
    }


    // DEBUGGING in dialogflow workaround

    /**
     * Returns user id
     * @return {string}
     */
    getUserId() {
        return 'DIALOGFLOW-DEBUGGING-USER-ID';
    }

    /**
     * Returns user id
     * @return {string}
     */
    getAccessToken() {
        return 'DIALOGFLOW-DEBUGGING-ACCESSTOKEN';
    }

    /**
     * Returns user id
     * @return {string}
     */
    getAccessToken() {
        return 'DIALOGFLOW-DEBUGGING-ACCESSTOKEN';
    }

    /**
     * Returns locale
     * @return {String}
     */
    getLocale() {
       return this.getLanguageCode();
    }

    /**
     * Gets request type and maps to jovo request types
     * @public
     * @return {string}
     */
    getRequestType() {
        return BaseApp.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Returns true if session is new
     * @return {boolean}
     */
    isNewSession() {
        return true;
    }
}

module.exports.DialogFlowV2Request = DialogFlowV2Request;
