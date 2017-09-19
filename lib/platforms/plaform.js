'use strict';
/**
 * Class Platform
 */
class Platform {
    /**
     * Constructor
     */
    constructor() {
        this.response = {};
        this.request = {};
        this.jovo = {};
    }

    /**
     * Returns unique user id sent by the platforms.
     * @public
     * @return {string} UserId
     */
    getUserId() {
        return this.request.getUserId();
    }

    /**
     * Returns intent name from request
     * @public
     * @return {string}
     */
    getIntentName() {
        return this.request.getIntentName();
    }

    /**
     * Returns platform's locale
     * @return {string}
     */
    getLocale() {
        return this.request.getLocale();
    }

    /**
     * Returns access token
     * @return {*}
     */
    getAccessToken() {
        return this.request.getAccessToken();
    }
    /**
     * isNewSession
     * @return {boolean}
     */
    isNewSession() {
        return this.request.isNewSession();
    }

    /**
     * Returns platform's timestamp
     * @return {string}
     */
    getTimestamp() {
        return this.request.getTimestamp();
    }

    /**
     * Returns audio capibility of device
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.request.hasAudioInterface();
    }

    /**
     * Returns screen capibility of device
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.request.hasScreenInterface();
    }

    /**
     * Returns speech text
     * @return {string}
     */
    getSpeechText() {
        return this.response.getSpeechText();
    }

    /**
     * Returns AlexaResponse object.
     * @return {AlexaRequest|GoogleActionRequest}
     */
    getResponse() {
        return this.response;
    }

    /**
     * Returns platform object
     * @return {AlexaRequest|GoogleActionRequest}
     */
    getRequest() {
        return this.request;
    }

    /**
     * Returns response object
     * @return {object}
     */
    getResponseObject() {
        return this.response.getResponseObject();
    }

    /**
     * Sets "raw" response object
     * @param {object} responseObj
     */
    setResponseObject(responseObj) {
        this.response.responseObj = responseObj;
        this.jovo.respond();
    }
}

module.exports.Platform = Platform;
