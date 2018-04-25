'use strict';

const _ = require('lodash');
const AlexaRequest = require('./alexaRequest').AlexaRequest;

/**
 * Alexa request with context object.
 * Inherits from AlexaRequest class
 */
class AlexaRequestContext extends AlexaRequest {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }


    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.hasScreenInterface() ||
            typeof _.get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined';
    }
    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioPlayerInterface() {
        return this.hasScreenInterface() ||
            typeof _.get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined';
    }

    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface() {
        return typeof _.get(this.getSupportedInterfaces(), 'Display') !== 'undefined';
    }

    /**
     * Returns display capability of request device
     * @return {boolean}
     */
    hasDisplayInterface() {
        return typeof _.get(this.getSupportedInterfaces(), 'Display') !== 'undefined';
    }

    /**
     * Returns video capability of request device
     * @return {boolean}
     */
    hasVideoInterface() {
        return typeof _.get(this.getSupportedInterfaces(), 'VideoApp') !== 'undefined';
    }
    /**
     * Returns application id (Skill id).
     * @return {string}
     */
    getApplicationId() {
        return _.get(this, 'context.System.application.applicationId');
    }

    /**
     * Returns unique, skill scoped, user id
     * @return {string}
     */
    getUserId() {
        return _.get(this, 'context.System.user.userId');
    }

    /**
     * Returns audio player activity
     * @return {string}
     */
    getAudioPlayerActivity() {
        return _.get(this, 'context.AudioPlayer.playerActivity');
    }

    /**
     * Returns audio player token
     * @return {string}
     */
    getAudioPlayerToken() {
        return _.get(this, 'context.AudioPlayer.token',
            _.get(this, 'request.token'));
    }

    /**
     * Returns audio player offset in milliseconds
     * @return {int}
     */
    getAudioPlayerOffsetInMilliseconds() {
        return _.get(this, 'context.AudioPlayer.offsetInMilliseconds');
    }
    /**
     * Returns device id
     * @return {string} device id
     */
    getDeviceId() {
        return _.get(this, 'context.System.device.deviceId');
    }

    /**
     * Returns supported interfaces from device.
     * @public
     * @return {string} supportedInterfaces
     */
    getSupportedInterfaces() {
        return _.get(this, 'context.System.device.supportedInterfaces');
    }

    /**
     * Returns api endpoint based on user's locale settings
     * @return {String} endpoint url
     */
    getApiEndpoint() {
        return _.get(this, 'context.System.apiEndpoint');
    }

    /**
     * Returns api access token
     * @return {s}
     */
    getApiAccessToken() {
        return _.get(this, 'context.System.apiAccessToken');
    }

    /**
     * Returns context object
     * @return {*} context
     */
    getContext() {
        return this.context;
    }

    /**
     * Returns consent token
     * @return {string} constent token
     */
    getConsentToken() {
        return _.get(this, 'context.System.user.permissions.consentToken');
    }

    /**
     * Returns access token
     * @return {string}
     */
    getAccessToken() {
        return _.get(this, 'context.System.user.accessToken');
    }

    /**
     * Sets application id
     * @param {string} applicationId
     * @return {AlexaRequestContext}
     */
    setApplicationId(applicationId) {
        _.set(this, 'context.System.application.applicationId', applicationId);
        return this;
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {AlexaRequestContext}
     */
    setUserId(userId) {
        _.set(this, 'context.System.user.userId', userId);
        return this;
    }

    /**
     * Sets audio player activity
     * @param {string} playerActivity
     * @return {AlexaRequestContext}
     */
    setAudioPlayerActivity(playerActivity) {
        _.set(this, 'context.AudioPlayer.playerActivity', playerActivity);
        return this;
    }

    /**
     * Sets audio player offset in millisecondes
     * @param {int} offsetInMilliseconds
     * @return {AlexaRequestContext}
     */
    setAudioPlayerOffsetInMilliseconds(offsetInMilliseconds) {
        _.set(this, 'context.AudioPlayer.offsetInMilliseconds', offsetInMilliseconds);
        return this;
    }

    /**
     * Sets AudioPlayer token
     * @param {string} token
     * @return {AlexaRequestContext}
     */
    setAudioPlayerToken(token) {
        _.set(this, 'context.AudioPlayer.token', token);
        return this;
    }

    /**
     * Sets device id
     * @param {string} deviceId
     * @return {AlexaRequestContext}
     */
    setDeviceId(deviceId) {
        _.set(this, 'context.System.device.deviceId', deviceId);
        return this;
    }

    /**
     * Sets supported interfaces object
     * @param {*} supportedInterfaces
     * @return {AlexaRequestContext}
     */
    setSupportedInterfaces(supportedInterfaces) {
        _.set(this, 'context.System.device.supportedInterfaces', supportedInterfaces);
        return this;
    }

    /**
     * Sets api endpoint url
     * @param {string} apiEndpoint
     * @return {AlexaRequestContext}
     */
    setApiEndpoint(apiEndpoint) {
        _.set(this, 'context.System.apiEndpoint', apiEndpoint);
        return this;
    }

    /**
     * Returns api access token
     * @param {string} apiAccessToken
     * @return {AlexaRequestContext}
     */
    setApiAccessToken(apiAccessToken) {
        return _.set(this, 'context.System.apiAccessToken', apiAccessToken);
    }
    /**
     * Sets full context object
     * @param {*} context
     * @return {AlexaRequestContext}
     */
    setContext(context) {
        this.context = context;
        return this;
    }

    /**
     * Sets consent token
     * @param {string} consentToken
     * @return {AlexaRequestContext}
     */
    setConsentToken(consentToken) {
        _.set(this, 'context.System.user.permissions.consentToken', consentToken);
        return this;
    }

    /**
     * Sets access token
     * @param {string} accessToken
     * @return {AlexaRequestContext}
     */
    setAccessToken(accessToken) {
        _.set(this, 'context.System.user.accessToken', accessToken);
        return this;
    }

}

module.exports.AlexaRequestContext = AlexaRequestContext;
