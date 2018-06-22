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
     * Sets intetn name
     * @param {string} intentName
     * @return {DialogFlowRequest}
     */
    setIntentName(intentName) {
        _.set(this, 'queryResult.intent.displayName', intentName);
        return this;
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
     * Sets result resolved query
     * @param {String} queryText
     * @return {string}
     */
    setQueryText(queryText) {
        _.set(this, 'queryResult.queryText', queryText);
        return this;
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
     * Sets parameters
     * @param {*} parameters
     * @return {DialogFlowRequest}
     */
    setParameters(parameters) {
        _.set(this, 'queryResult.parameters', parameters);
        return this;
    }

    /**
     * Set parameter
     * @param {string} name
     * @param {*} value
     * @return {DialogFlowRequest}
     */
    setParameter(name, value) {
        _.set(this, `queryResult.parameters.${name}`, value);
        return this;
    }

    /**
     * Add parameter
     * @param {string} name
     * @param {*} value
     * @return {DialogFlowRequest}
     */
    addParameter(name, value) {
        return this.setParameter(name, value);
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
        if (this.getContexts()) {
            for (let context of this.getContexts()) {
                let contextNameArray = context.name.split('/');
                if (contextNameArray[contextNameArray.length - 1] === name) {
                    return context;
                }
            }
        }
    }

    /**
     * Sets full contexts array
     * @param {*} context
     * @return {DialogFlowV2Request}
     */
    setContext(context) {
        let newContexts = [context];
        for (let obj of _.get(this, 'queryResult.outputContexts')) {
            if (obj.name !== context.name) {
                newContexts.push(obj);
            }
        }
        _.set(this, 'queryResult.outputContexts', newContexts);
        return this;
    }

    /**
     * Sets state
     * @param {string} state
     * @return {DialogFlowRequest}
     */
    setState(state) {
        let sessionContext = this.getContext('session');
        if (!sessionContext) {
            this.setContext({
                name: 'session',
                lifespanCount: 100,
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
     * Returns session attributes
     * @return {*}
     */
    getSessionAttributes() {
        if (this.getContext('session')) {
            return this.getContext('session').parameters;
        }
        return {};
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

    /**
     * Returns sessions new value
     * @return {boolean}
     */
    getSessionNew() {
        return !(_.get(this, 'originalDetectIntentRequest.payload.conversation.type') === 'ACTIVE');
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
     * Returns locale
     * hardcoded: debugging only
     * @return {String}
     */
    getLocale() {
        // hardcoded workaround
        if (this.getLanguageCode().length === 5) {
            return this.getLanguageCode();
        }

        if (this.getLanguageCode() === 'de') {
            return 'de-de';
        } else if (this.getLanguageCode() === 'fr') {
            return 'fr-fr';
        } else {
            return 'en-us';
        }
    }

    /**
     * Sets language
     * @param {string} lang
     * @return {DialogFlowRequest}
     */
    setLanguageCode(lang) {
        _.set(this, 'queryResult.languageCode', lang);
        return this;
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

    /**
     * Add input to request object
     * @param {string} name
     * @param {*} value
     * @return {*}
     */
    addInput(name, value) {
        return this.addParameter(name, value);
    }

    // workarounds for testing from the DialogFlow Debugger

    /**
     * Returns true if device has an audio interface
     * @return {boolean}
     */
    hasAudioInterface() {
        return true;
    }

    /**
     * Returns true if device has an screen interface
     * @return {boolean}
     */
    hasScreenInterface() {
        return true;
    }

    /**
     * Returns user object from request
     * @return {*}
     */
    getUser() {
        return {};
    }

    /**
     * Returns device object from request
     * @return {*}
     */
    getDevice() {
        return {};
    }
}

module.exports.DialogFlowV2Request = DialogFlowV2Request;
