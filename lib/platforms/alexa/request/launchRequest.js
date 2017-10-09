'use strict';

const _ = require('lodash');
const Request = require('./request').Request;

class LaunchRequest extends Request {

    constructor(request) {
        super(request);
    }

    getSession() {
        return this.session;
    }

    getSessionNew() {
        return this.session.new;
    }

    getSessionId() {
        return this.session.sessionId;
    }

    getApplicationId() {
        return _.get(this, 'session.application.applicationId',
            _.get(this, 'context.System.application.applicationId'));
    }

    getUserId() {
        return _.get(this, 'session.user.userId',
            _.get(this, 'context.System.user.userId'));
    }

    /**
     * Returns audio player activity
     * @return {string}
     */
    getAudioPlayerActivity() {
        return _.get(this, 'context.AudioPlayer.playerActivity');
    }
    /**
     * Returns device id
     * @return {string} device id
     */
    getDeviceId() {
        return _.get(this, 'context.System.device.deviceId');
    }

    getSupportedInterfaces() {
        return _.get(this, 'context.System.device.supportedInterfaces');
    }

    /**
     * Returns platform's locale
     * @return {String} locale
     */
    getApiEndpoint() {
        return _.get(this, 'context.System.apiEndpoint');
    }

    getContext() {
        return this.context;
    }


    setSession(session) {
        this.session = session;
        return this;
    }

    setSessionNew(sessionNew) {
        _.set(this, 'session.new', sessionNew);
        return this;
    }

    setSessionId(sessionId) {
        _.set(this, 'session.sessionId', sessionId);
        return this;
    }

    setApplicationId(applicationId) {
        _.set(this, 'session.application.applicationId', applicationId);
        _.set(this, 'context.System.application.applicationId', applicationId);
        return this;
    }

    setUserId(userId) {
        _.set(this, 'session.user.userId', userId);
        _.set(this, 'context.System.user.userId', userId);
        return this;
    }

    setAudioPlayerActivity(playerActivity) {
        _.set(this, 'context.AudioPlayer.playerActivity', playerActivity);
        return this;
    }

    setDeviceId(deviceId) {
        _.set(this, 'context.System.device.deviceId', deviceId);
        return this;
    }
    setSupportedInterfaces(supportedInterfaces) {
        _.set(this, 'context.System.device.supportedInterfaces', supportedInterfaces);
        return this;
    }
    setApiEndpoint(apiEndpoint) {
        _.get(this, 'context.System.apiEndpoint', apiEndpoint);
        return this;
    }

    setContext(context) {
        this.context = context;
        return this;
    }


}

module.exports.LaunchRequest = LaunchRequest;
