'use strict';

const _ = require('lodash');
const AlexaRequestContext = require('./alexaRequestContext').AlexaRequestContext;

/**
 * Alexa audio player request
 * Inherits from AlexaRequestContext class
 */
class AudioPlayerRequest extends AlexaRequestContext {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Returns offset in milliseconds
     * @return {int} offset
     */
    getOffsetInMilliseconds() {
        return _.get(this, 'request.offsetInMilliseconds');
    }

    /**
     * Returns audio player track token
     * @return {string}
     */
    getToken() {
        return _.get(this, 'context.AudioPlayer.token',
            _.get(this, 'request.token'));
    }

    /**
     * Returns error object
     * @return {*}
     */
    getError() {
        return _.get(this, 'request.error');
    }

    /**
     * Returns currentPlaybackState object
     * @return {*}
     */
    getCurrentPlaybackState() {
        return _.get(this, 'request.currentPlaybackState');
    }

    /**
     * Sets offset in milliseconds
     * @param {int} offsetInMilliseconds
     * @return {AudioPlayerRequest}
     */
    setOffsetInMilliseconds(offsetInMilliseconds) {
        _.set(this, 'request.offsetInMilliseconds', offsetInMilliseconds);
        return this;
    }

    /**
     * Sets token
     * @param {string} token
     * @return {AudioPlayerRequest}
     */
    setToken(token) {
        _.set(this, 'request.token', token);
        return this;
    }

    /**
     * Sets error object
     * @param {*} error
     * @return {AudioPlayerRequest}
     */
    setError(error) {
        _.set(this, 'request.error', error);
        return this;
    }

    /**
     * Sets currentPlaybackState object
     * @param {*} currentPlaybackState
     * @return {AudioPlayerRequest}
     */
    setCurrentPlaybackState(currentPlaybackState) {
        _.set(this, 'request.currentPlaybackState', currentPlaybackState);
        return this;
    }

}

module.exports.AudioPlayerRequest = AudioPlayerRequest;
