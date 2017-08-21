'use strict';

const _ = require('lodash');

const jovo = require('../../jovo');
const GoogleActionRequest = require('./googleActionRequest').GoogleActionRequest;
const GoogleActionResponse= require('./googleActionResponse').GoogleActionResponse;
const CardBuilder = GoogleActionResponse.CardBuilder;
/**
 * Class GoogleAction (GoogleHome + GoogleAssistant)
 */
class GoogleAction {

    /**
     * Constructor
     * @public
     * @param {Jovo} jovo
     * @param {object} request
     */
    constructor(jovo, request) {
        this.jovo = jovo;
        this.request = new GoogleActionRequest(request);
        this.response = new GoogleActionResponse();

        this.response.setContextOut(this.request.getContexts());
    }

    /** **
     * Request getter
     */

    /**
     * TODO: Test me
     * Returns unique user id sent by the platforms.
     * @public
     * @return {string} UserId
     */
    getUserId() {
        return this.request.getUserId();
    }

    /**
     * TODO: test me
     * Returns intent name from request
     * @public
     * @return {string}
     */
    getIntentName() {
        return this.request.getIntentName();
    }

    /**
     * Returns application ID  of the request
     * NO APPLICATION ID FROM GOOGLE REQUESTS
     * TODO: any idea for google actions?
     * @return {String} applicationId
     */
    getApplicationId() {
        return '';
    }

    /**
     * TODO: Test me
     * Returns original request object.
     * Does not work with API.AI testing.
     * @return {*}
     */
    getOriginalRequest() {
        return this.request.getOriginalRequest();
    }


    /** *****************************************************
     *
     * JOVO wrapper functions
     *
     ************************************/


    /**
     * TODO: test me
     * Gets request type and maps to jovo request types
     * GOOGLE_ASSISTANT_WELCOME => LAUNCH
     * else => INTENT
     * TODO: any ideas how to get end request?
     * @public
     * @return {string}
     */
    getRequestType() {
        if (this.request.getResolvedQuery() === 'GOOGLE_ASSISTANT_WELCOME') {
            return jovo.REQUEST_TYPE_ENUM.LAUNCH;
        }
        return jovo.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Returs GoogleActionRequest instance
     * @return {GoogleActionRequest}
     */
    getRequest() {
        return this.request;
    }

    /**
     * TODO: possible with GoogleAction?
     * Returns reason when a session ended.
     * Does not work with GoogleAction?
     * @public
     * @return {*}
     */
    getEndReason() {
        return 'DUMMY';
    }

    /**
     * TODO: test me
     * Ends session without saying anything
     */
    endSession() {
        this.response.tell('<break time="1ms"/>');
    }

    /**
     * TODO: test me
     * Returns intent parameters filled by the user.
     * "My name is {John Doe} and I live in {New York}"
     * Returns object with name => value objects
     * {
     *   name : "John Doe",
     *   city : "New York"
     * }
     * @public
     * @return {*}
     */
    getInputs() {
        return this.request.getParameters();
    }

    /**
     * TODO: test me
     * Get input object by name
     * @public
     * @param {string} name
     * @return {*}
     */
    getInput(name) {
        return this.getInputs()[name];
    }

    /**
     * TODO: test me
     * Returns type of platform
     * @public
     * @return {string}
     */
    getType() {
        return jovo.PLATFORM_ENUM.GOOGLE_ACTION;
    }

    /**
     * TODO: test me
     * Returns platform's locale
     * @return {string}
     */
    getLocale() {
        return this.request.getLocale();
    }

    /**
     * TODO: test me
     * @return {boolean}
     */
    isNewSession() {
        return this.request.isNewSession();
    }

    /**
     * TODO: test me
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
      return this.getSessionAttribute('STATE');
    }

    /**
     * TODO: test me
     * Returns speech text
     * @return {string}
     */
    getSpeechText() {
        return this.response.getSpeechText();
    }

    /** ***********************************************************
     *
     * RESPONSE BUILDER FUNCTIONS
     *
     */

    /**
     * Returns GoogleActionResponse object.
     * @return {GoogleActionResponse|*}
     */
    getResponse() {
        return this.response;
    }


    /**
     * TODO: test me
     * Returns session attribute value
     * from the response(!) object
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return _.get(this.getSessionAttributes(), name);
    }

    /**
     * TODO: test me
     * Returns all session attributes
     * from the response(!) object.
     * @public
     * @return {*}
     */
    getSessionAttributes() {
        let context = this.response.getContextOut('session');
        if (Object.keys(context).length === 0) {
            return {};
        }
        return context.parameters;
    }

    /**
     * TODO: test me
     * Returns response object
     * @public
     * @return {object}
     */
    getResponseObject() {
        return this.response.getResponseObject();
    }

    /**
     * TODO: test me
     * Sets "raw" response object
     * @param {object} responseObj
     * @return {GoogleAction} this
     */
    setResponseObject(responseObj) {
        this.response.responseObj = responseObj;
        return this;
    }

    /**
     * TODO: test me
     * Stores state in response object session
     * @public
     * @param {string} state
     */
    setState(state) {
        this.setSessionAttribute('STATE', state);
    }

    /**
     * TODO: test me
     * Sets session attribute with value
     * @public
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        let sessionAttributes = this.getSessionAttributes();

        if (Object.keys(sessionAttributes).length === 0) {
            this.response.addContextOutObject({
                name: 'session',
                lifespan: 10000,
                parameters: {},
            });
            this.response.addContextOutParameter('session', name, value);
        } else {
            this.response.addContextOutParameter('session', name, value);
        }
    }

    /**
     * TODO: test me
     * Sets session attributes
     * @param {object} attributes
     * @param {*} value
     */
    setSessionAttributes(attributes) {
        _.map(attributes, (value, name) => {
            this.response.addContextOutParameter('session', name, value);
        });
    }

    /**
     * TODO: test me
     * Sets speech output
     * @public
     * @param {string} speech
     */
    tell(speech) {
        this.response.tell(speech);
    }

    /**
     * TODO: test me
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @public
     * @param {string} audioUrl
     * @param {string} fallbackText
     */
    play(audioUrl, fallbackText) {
        let speech = '<speak><audio src="'+audioUrl+'">' + fallbackText + '</audio></speak>';
        this.tell(speech);
    }

    /**
     * TODO: test me
     * Creates object with reprompt.
     * Keeps session open
     * @public
     * @param {string} speech
     * @param {string} repromptSpeech
     */
    ask(speech, repromptSpeech) {
        this.response.ask(speech, repromptSpeech);
    }


    /**
     * TODO: test me
     * Implementation of generic withSimpleCard
     * Shows a simple card to the response object
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @return {GoogleAction} this
     */
    showSimpleCard(title, formattedText) {
        this.response.addBasicCard(title, formattedText);
        return this;
    }
    /**
     * TODO: test me
     * Implementation of generic withImageCard
     * Shows a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageObject object with secured image url
     * @return {GoogleAction} this
     */
    showImageCard(title, formattedText, imageObject) {
        const imageUrl = _.isString(imageObject) ? imageObject : imageObject.largeImageUrl;

        this.response.addImageCard(title, formattedText, imageUrl, title);
        return this;
    }


    /**
     * Returns Google Assistant CardBuilder instance
     * @public
     * @return {CardBuilder}
     */
    getCardBuilder() {
        return new CardBuilder();
    }

    /**
     * Returns state of dialog
     * @return {jovo.DIALOGSTATE_ENUM}
     */
    getDialogState() {
        if (this.request.result.actionIncomplete === true) {
            return jovo.DIALOGSTATE_ENUM.IN_PROGRESS;
        }
        if (this.request.result.actionIncomplete === false) {
            return jovo.DIALOGSTATE_ENUM.DONE;
        }
    }

    /**
     * Continues dialog.
     */
    continueDialog() {
        this.ask(this.request.result.fulfillment.speech,
            this.request.result.fulfillment.speech);
    }
}


module.exports.GoogleAction = GoogleAction;
