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
        return _.get(this, 'requestObj.originalRequest');
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
        const defaultValue = {}; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.user', defaultValue);
    }

    /**
     * Returns user's profile
     * @return {object} profile
     */
    getUserProfile() {
        const defaultValue = {}; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.user.profile', defaultValue);
    }

    /**
     * Returns user's access token
     * @return {object} accessToken
     */
    getAccessToken() {
        const defaultValue = ''; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.user.accessToken', defaultValue);
    }

    /**
     * Returns permissions granted by the user
     * @return {array} permissions
     */
    getGrantedPermissions() {
        const defaultValue = []; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.user.permissions', defaultValue);
    }

    /**
     * Returns users' locale
     * @return {String} locale
     */
    getLocale() {
        return _.get(this.getOriginalRequest(), 'data.user.locale', DEFAULT_LOCALE);
    }

    /**
     * Returns device's information
     * @return {object} device
     */
    getDeviceObject() {
        const defaultValue = {}; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.device', defaultValue);
    }

    /**
     * Returns device's coordinates
     * @return {object} coordinates
     */
    getCoordinates() {
        const defaultValue = {}; // API.AI Debugging

        return _.get(this.getDeviceObject(), 'location.coordinates', defaultValue);
    }

    /**
     * Returns device's latitude
     * @return {string} latitude
     */
    getDeviceLatitude() {
        const defaultValue = ''; // API.AI Debugging

        return _.get(this.getDeviceObject(), 'location.coordinates.latitude', defaultValue);
    }

    /**
     * Returns device's longitude
     * @return {string} longitude
     */
    getDeviceLongitude() {
        const defaultValue = ''; // API.AI Debugging

        return _.get(this.getDeviceObject(), 'location.coordinates.longitude', defaultValue);
    }

    /**
     * Returns device's formatted address
     * @return {object} address
     */
    getDeviceFormattedAddress() {
        const defaultValue = ''; // API.AI Debugging

        return _.get(this.getDeviceObject(), 'location.formatted_address', defaultValue);
    }

    /**
     * Returns device's zip code
     * @return {object} zip_code
     */
    getDeviceZipCode() {
        const defaultValue = ''; // API.AI Debugging

        return _.get(this.getDeviceObject(), 'location.zip_code', defaultValue);
    }

    /**
     * Returns device's city
     * @return {object} city
     */
    getDeviceCity() {
        const defaultValue = ''; // API.AI Debugging

        return _.get(this.getDeviceObject(), 'location.city', defaultValue);
    }

    /**
     * Returns device's capabilities
     * @return {array} capabilities
     */
    getDeviceCapabilities() {
        const defaultValue = []; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.surface.capabilities', defaultValue);
    }

    /**
     * Returns conversation
     * @return {object} conversation
     */
    getConversation() {
        const defaultValue = {}; // API.AI Debugging

        return _.get(this.getOriginalRequest(), 'data.conversation', defaultValue);
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
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface() {
        let capabilities = this.getDeviceCapabilities();

        for (let obj of capabilities) {
            if (obj.name === 'actions.capability.AUDIO_OUTPUT') {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface() {
        let capabilities = this.getDeviceCapabilities();

        for (let obj of capabilities) {
            if (obj.name === 'actions.capability.SCREEN_OUTPUT') {
                return true;
            }
        }
        return false;
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
     * Returns raw input type
     * @return {string}
     */
    getRawInputType() {
       return _.get(this.getOriginalRequest(), 'data.inputs[0].rawInputs[0].inputType');
    }

    /**
     * Returns true if input type is touch
     * @return {boolean}
     */
    isTouchInputType() {
        return this.getRawInputType() === 'TOUCH';
    }

    /**
     * Returns true if request is an 'options' intent
     * @return {boolean}
     */
    isOptionsIntent() {
        return _.get(this.getOriginalRequest(), 'data.inputs[0].intent') === 'actions.intent.OPTION';
    }

    /**
     * Returns raw text of touch input
     * @return {string}
     */
    getTouchInputValue() {
        return _.get(this.getOriginalRequest(), 'data.inputs[0].arguments[0].rawText');
    }

    /**
     * Returns valiue of selected option item
     * @return {*}
     */
    getSelectedOptionItem() {
        if (_.get(this.getOriginalRequest(), 'data.inputs[0].arguments[0].name') !== 'OPTION') {
            return;
        }
        return _.get(this.getOriginalRequest(), 'data.inputs[0].arguments[0].textValue');
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
