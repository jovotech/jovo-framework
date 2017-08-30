'use strict';

const _ = require('lodash');

const DEFAULT_LOCALE = 'en-US';

/**
 * GoogleActionRequest Class
 */
class GoogleActionRequest {
    /**
     * Constructor
     * @param {{}} requestObj
     */
    constructor(requestObj) {
        this.requestObj = requestObj;
    }

    /**
     * Returns unique user id sent by the platforms.
     * @public
     * @return {string} UserId
     */
    getUserId() {
        if (!this.getOriginalRequest()) {
            return 'API.AI Debugging';
        }
        return this.getOriginalRequest().data.user.userId;
    }

    /**
     * Returns original request object.
     * Does not work with API.AI testing.
     * @return {*}
     */
    getOriginalRequest() {
        return this.requestObj.originalRequest;
    }

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return this.requestObj.result.metadata.intentName;
    }

    /**
     * Returns user's information
     * @return {object} user
     */
    getUserObject() {
        if (!this.getOriginalRequest()) {
            return {}; // API.AI Debugging
        }
        return this.getOriginalRequest().data.user;
    }

    /**
     * Returns user's profile
     * @return {object} profile
     */
    getUserProfile() {
        if (!this.getOriginalRequest()) {
            return {}; // API.AI Debugging
        }
        return this.getOriginalRequest().data.user.profile;
    }

    /**
     * Returns user's access token
     * @return {object} accessToken
     */
    getAccessToken() {
        if (!this.getOriginalRequest()) {
            return ''; // API.AI Debugging
        }
        return this.getOriginalRequest().data.user.accessToken;
    }

    /**
     * Returns permissions granted by the user
     * @return {array} permissions
     */
    getGrantedPermissions() {
        if (!this.getOriginalRequest()) {
            return []; // API.AI Debugging
        }

        return this.getOriginalRequest().data.user.permissions;
    }

    /**
     * Returns users' locale
     * @return {String} locale
     */
    getLocale() {
        if (!this.getOriginalRequest()) {
            return DEFAULT_LOCALE;
        }

        return this.getOriginalRequest().data.user.locale;
    }

    /**
     * Returns device's information
     * @return {object} device
     */
    getDeviceObject() {
        if (!this.getOriginalRequest()) {
            return {}; // API.AI Debugging
        }
        return this.getOriginalRequest().data.device;
    }

    /**
     * Returns device's coordinates
     * @return {object} coordinates
     */
    getCoordinates() {
        if (!this.getOriginalRequest()) {
            return {}; // API.AI Debugging
        }

        return _.get(this.getDeviceObject(), 'location.coordinates');
    }

    /**
     * Returns device's latitude
     * @return {string} latitude
     */
    getDeviceLatitude() {
        if (!this.getOriginalRequest()) {
            return ''; // API.AI Debugging
        }

        return _.get(this.getDeviceObject(), 'location.coordinates.latitude');
    }

    /**
     * Returns device's longitude
     * @return {string} longitude
     */
    getDeviceLongitude() {
        if (!this.getOriginalRequest()) {
            return ''; // API.AI Debugging
        }

        return _.get(this.getDeviceObject(), 'location.coordinates.longitude');
    }

    /**
     * Returns device's formatted address
     * @return {object} address
     */
    getDeviceFormattedAddress() {
        if (!this.getOriginalRequest()) {
            return ''; // API.AI Debugging
        }

        return _.get(this.getDeviceObject(), 'location.formatted_address');
    }

    /**
     * Returns device's zip code
     * @return {object} zip_code
     */
    getDeviceZipCode() {
        if (!this.getOriginalRequest()) {
            return ''; // API.AI Debugging
        }

        return _.get(this.getDeviceObject(), 'location.zip_code');
    }

    /**
     * Returns device's city
     * @return {object} city
     */
    getDeviceCity() {
        if (!this.getOriginalRequest()) {
            return ''; // API.AI Debugging
        }

        return _.get(this.getDeviceObject(), 'location.city');
    }

    /**
     * Returns device's capabilities
     * @return {array} capabilities
     */
    getDeviceCapabilities() {
        if (!this.getOriginalRequest()) {
            return []; // API.AI Debugging
        }

        return this.getOriginalRequest().data.surface.capabilities;
    }

    /**
     * Returns conversation
     * @return {object} conversation
     */
    getConversation() {
        if (!this.getOriginalRequest()) {
            return {}; // API.AI Debugging
        }

        return this.getOriginalRequest().data.conversation;
    }

    /**
     * isNewSession
     * @return {boolean}
     */
    isNewSession() {
        // API.AI Debugging doesn't have an original request
        if (!this.getOriginalRequest()) {
            return true;
        }
        return this.getOriginalRequest().data.conversation.type === 'NEW';
    }

    /**
     * Returns platform's timestamp
     * @return {String} timestamp
     */
    getTimestamp() {
        return this.requestObj.timestamp;
    }

    /**
     * Returns resolved query
     * @return {string}
     */
    getResolvedQuery() {
        return this.requestObj.result.resolvedQuery;
    }

    /**
     * Returns intent parameters
     * @return {*}
     */
    getParameters() {
        return this.requestObj.result.parameters;
    }

    /**
     * Returns contexts
     * @return {*}
     */
    getContexts() {
       return this.requestObj.result.contexts;
    }

    /**
     * Returns contextout object by name
     * @param {string} name
     * @return {*}
     */
    getContextOut(name) {
        for (let i = 0; i < this.requestObj.result.contexts.length; i++) {
            if (this.requestObj.result.contexts[i].name === name) {
                return this.requestObj.result.contexts[i];
            }
        }
        return {};
    }

    /**
     * Returns response object
     * @return {object}
     */
    getRequestObject() {
        return this.requestObj;
    }
}

module.exports.GoogleActionRequest = GoogleActionRequest;
