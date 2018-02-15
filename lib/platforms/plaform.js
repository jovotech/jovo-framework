'use strict';
const EventEmitter = require('events');

/**
 * Interface Platform
 * @class
 * @interface
 */
class Platform extends EventEmitter {

    /** **
     * NLU public functions
     */

    /**
     * Returns intent name from request
     * @abstract
     * @return {string}
     */
    getIntentName() {
    }

    /**
     * Returns intent parameters filled by the user.
     * "My name is {John Doe} and I live in {New York}"
     * Returns object with name => value objects
     * {
     *   name : "John Doe",
     *   city : "New York"
     * }
     * @abstract
     * @return {*}
     */
    getInputs() {
    }

    /**
     * Get input object by name
     * @abstract
     * @param {string} name
     * @return {string}
     */
    getInput(name) {
    }
    /**
     * Platform public functions
     */

    /**
     * Returns unique user id sent by the platforms.
     * @abstract
     * @return {string} UserId
     */
    getUserId() {
    }

    /**
     * Returns platform's locale
     * @abstract
     * @return {string}
     */
    getLocale() {
    }

    /**
     * Returns access token
     * @abstract
     * @return {*}
     */
    getAccessToken() {
    }
    /**
     * isNewSession
     * @abstract
     * @return {boolean}
     */
    isNewSession() {
    }

    /**
     * Returns platform's timestamp
     * @abstract
     * @return {string}
     */
    getTimestamp() {
    }

    /**
     * Returns audio capibility of device
     * @abstract
     * @return {boolean}
     */
    hasAudioInterface() {
    }

    /**
     * Returns screen capibility of device
     * @abstract
     * @return {boolean}
     */
    hasScreenInterface() {
    }

    /**
     * Returns video capibility of device
     * @alexa
     * @abstract
     * @return {boolean}
     */
    hasVideoInterface() {
    }

    /**
     * Returns device id
     * @abstract
     * @return {string} device id
     */
    getDeviceId() {
    }

    /**
     * Returns application ID (Skill ID) of the request
     * @abstract
     * @return {String} applicationId
     */
    getApplicationId() {
    }

    /**
     * Returns raw text
     * @abstract
     * @return {String} rawText
     */
    getRawText() {
    }

    /**
     * Returns token of the request
     * Works only with screen devices
     * @abstract
     * @return {*}
     */
    getSelectedElementId() {
    }

    /**
     * Returns platform object
     * @abstract
     * @return {AlexaRequest|GoogleActionRequest}
     */
    getRequest() {
    }

    /**
     * Returns type of platform
     * @abstract
     * @return {string}
     */
    getType() {
    }

    /**
     * Returns session attribute value
     * from the response(!) object
     * @abstract
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
    }

    /**
     * Returns all session attributes
     * from the response(!) object.
     * @abstract
     * @return {*}
     */
    getSessionAttributes() {
    }

    /**
     * Returns state value stored in the request session
     *
     * @abstract
     * @return {*}
     */
    getState() {
    }

    /**
     * Stores state in response object session
     * @abstract
     * @param {string} state
     */
    setState(state) {
    }

    /**
     * Sets session attributes
     * @abstract
     * @param {object} attributes
     */
    setSessionAttributes(attributes) {
    }

    /**
     * Sets session attribute with value
     * @abstract
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
    }

    /**
     * Creates alexa user instance
     * @abstract
     * @param {*} config
     * @return {User}
     */
    makeUser(config) {
    }

    /**
     * Sets speech output with ShouldEndSession = true
     *
     * @abstract
     * @param {string} speech
     */
    tell(speech) {
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @abstract
     * @param {string} speech
     * @param {string} repromptSpeech
     */
    ask(speech, repromptSpeech) {
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @abstract
     * @param {string} audioUrl
     */
    play(audioUrl) {
    }

    /**
     * Returns speech text
     * @abstract
     * @return {string}
     */
    getSpeechText() {
    }

    /**
     * Returns alexa specific speechbuilder
     * @abstract
     * @return {AlexaSpeechBuilder|GoogleActionSpeechBuilder}
     */
    getSpeechBuilder() {
    }

    /**
     * Ends session without saying anything
     * @abstract
     */
    endSession() {
    }


    /**
     * Returns AlexaResponse object.
     * @abstract
     * @return {AlexaResponse|GoogleActionResponse}
     */
    getResponse() {
    }

    /**
     * Returns response object
     * @abstract
     * @return {object}
     */
    getResponseObject() {
    }

    /**
     * Sets "raw" response object
     * @abstract
     * @param {object} responseObj
     */
    setResponseObject(responseObj) {
    }
}

module.exports.Platform = Platform;
