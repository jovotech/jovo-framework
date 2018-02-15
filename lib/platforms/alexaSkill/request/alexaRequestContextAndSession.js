'use strict';

const _ = require('lodash');
const AlexaRequestContext = require('./alexaRequestContext').AlexaRequestContext;

/**
 * Alexa request with context and session object
 */
class AlexaRequestContextAndSession extends AlexaRequestContext {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
    }

    /**
     * Sets session attribute to attributes object
     * @param {string} name
     * @param {*} value
     * @return {AlexaRequestContextAndSession}
     */
    setSessionAttribute(name, value) {
        _.set(this, `session.attributes[${name}]`, value);
        return this;
    }
    /**
     * Adds session attribute to attributes object
     * @param {string} name
     * @param {*} value
     * @return {AlexaRequestContextAndSession}
     */
    addSessionAttribute(name, value) {
        this.setSessionAttribute(name, value);
        return this;
    }

    /**
     * Sets state to session attributes
     * @param {string} stateName
     * @return {AlexaRequestContextAndSession}
     */
    setState(stateName) {
        this.setSessionAttribute('STATE', stateName);
        return this;
    }

    /**
     * Returns complete session object
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
        return _.get(this, 'session.new');
    }

    /**
     * Returns session id
     * @return {string}
     */
    getSessionId() {
        return _.get(this, 'session.sessionId');
    }
    /**
     * Returns boolean if request is part of new session
     * @return {boolean}
     */
    isNewSession() {
        return _.get(this, 'session.new');
    }

    /**
     * Returns application id (skill id)
     * @return {string} application id
     */
    getApplicationId() {
        return _.get(this, 'session.application.applicationId',
            _.get(this, 'context.System.application.applicationId'));
    }

    /**
     * Returns skill scoped user id
     * @return {*}
     */
    getUserId() {
        return _.get(this, 'session.user.userId',
            _.get(this, 'context.System.user.userId'));
    }

    /**
     * Returns all session attributes
     * @return {*}
     */
    getSessionAttributes() {
        return _.get(this, 'session.attributes');
    }
    /**
     * Returns session attribute value
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        if (!this.getSessionAttributes()) {
            return;
        }
        return this.getSessionAttributes()[name];
    }

    /**
     * Sets full session object
     * @param {*} session
     * @return {AlexaRequestContextAndSession}
     */
    setSession(session) {
        this.session = session;
        return this;
    }

    /**
     * Sets session new value
     * @param {boolean} sessionNew
     * @return {AlexaRequestContextAndSession}
     */
    setSessionNew(sessionNew) {
        _.set(this, 'session.new', sessionNew);
        return this;
    }

    /**
     * Sets session id
     * @param {string} sessionId
     * @return {AlexaRequestContextAndSession}
     */
    setSessionId(sessionId) {
        _.set(this, 'session.sessionId', sessionId);
        return this;
    }

    /**
     * Sets application id
     * @param {string} applicationId
     * @return {AlexaRequestContextAndSession}
     */
    setApplicationId(applicationId) {
        _.set(this, 'session.application.applicationId', applicationId);
        _.set(this, 'context.System.application.applicationId', applicationId);
        return this;
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {AlexaRequestContextAndSession}
     */
    setUserId(userId) {
        _.set(this, 'session.user.userId', userId);
        _.set(this, 'context.System.user.userId', userId);
        return this;
    }

    /**
     * Sets session attributes
     * @param {*} attributes
     * @return {AlexaRequestContextAndSession}
     */
    setSessionAttributes(attributes) {
        _.set(this, 'session.attributes', attributes);
        return this;
    }

}

module.exports.AlexaRequestContextAndSession = AlexaRequestContextAndSession;
