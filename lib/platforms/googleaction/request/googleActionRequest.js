'use strict';

const _ = require('lodash');
const BaseApp = require('./../../../app');

/**
 * Google Action request
 */
class GoogleActionRequest {
    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        if (request) {
            Object.assign(this, request);
        }
    }

    /**
     * Gets request type and maps to jovo request types
     * GOOGLE_ASSISTANT_WELCOME => LAUNCH
     * else => INTENT
     * TODO: any ideas how to get end request?
     * @public
     * @return {string}
     */
    getRequestType() {
        return BaseApp.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * HELPER FUNCTIONS
     */

    /**
     * Returns true if device has an audio interface
     * @return {boolean}
     */
    hasAudioInterface() {
        let capabilities = this.getSurfaceCapabilities();
        for (let obj of capabilities) {
            if (obj.name === 'actions.capability.AUDIO_OUTPUT') {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if device has an screen interface
     * @return {boolean}
     */
    hasScreenInterface() {
        let capabilities = this.getSurfaceCapabilities();

        for (let obj of capabilities) {
            if (obj.name === 'actions.capability.SCREEN_OUTPUT') {
                return true;
            }
        }
        return false;
    }

    /**
     * isNewSession
     * @return {boolean}
     */
    isNewSession() {
        return _.get(this, 'conversation.type') === 'NEW';
    }

    /**
     * Returns true if request is an 'options' intent
     * @return {boolean}
     */
    isOptionsIntent() {
        return _.get(this, 'inputs[0].intent') === 'actions.intent.OPTION';
    }

    /**
     * Returns true if request is an 'sign in' intent
     * @return {boolean}
     */
    isSignInIntent() {
        return _.get(this, 'inputs[0].intent') === 'actions.intent.SIGN_IN';
    }

    /**
     * Returns true if request is an cancel intent
     * @return {boolean}
     */
    isCancelIntent() {
        return _.get(this, 'inputs[0].intent') === 'actions.intent.CANCEL';
    }

    /**
     * Returns true if request is an media status intent
     * @return {boolean}
     */
    isMediaStatusIntent() {
        return _.get(this, 'inputs[0].intent') === 'actions.intent.MEDIA_STATUS';
    }

    /**
     * Returns true if request is an cancel intent
     * @return {boolean}
     */
    isPermissionIntent() {
        return _.get(this, 'inputs[0].intent') === 'actions.intent.PERMISSION';
    }

    /**
     * Returns true if the permission was granted by the user
     * @return {boolean}
     */
    isPermissionGranted() {
        return this.isPermissionIntent() &&
            _.get(this, 'inputs[0].arguments[0].name') === 'PERMISSION' &&
            _.get(this, 'inputs[0].arguments[0].boolValue') === true;
    }

    /**
     * Returns true if input type is touch
     * @return {boolean}
     */
    isTouchInputType() {
        return this.getRawInputType() === 'TOUCH';
    }

    /**
     * Returns raw text of touch input
     * @return {string}
     */
    getTouchInputValue() {
        return _.get(this, 'inputs[0].arguments[0].rawText');
    }

    /**
     * Returns rawtext
     * @return {string}
     */
    getRawText() {
        return _.get(this, 'inputs[0].arguments[0].rawText') ||
            _.get(this, 'inputs[0].rawInputs[0].query');
    }

    /**
     * Sets raw text
     * @param {String} rawText
     * @return {GoogleActionRequest}
     */
    setRawText(rawText) {
        _.set(this, 'inputs[0].arguments[0].rawText', rawText);
        _.set(this, 'inputs[0].rawInputs[0].query', rawText);
        return this;
    }

    /**
     * Returns true if input type is touch
     * @return {boolean}
     */
    isKeyboardInputType() {
        return this.getRawInputType() === 'KEYBOARD';
    }

    /**
     * Returns valiue of selected option item
     * @return {*}
     */
    getSelectedOptionItem() {
        if (_.get(this, 'inputs[0].arguments[0].name') !== 'OPTION') {
            return;
        }
        return _.get(this, 'inputs[0].arguments[0].textValue');
    }

    /**
     * Returns sign in status after sign in
     * @return {null|string}
     */
    getSignInStatus() {
        for (let argument of _.get(this, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'SIGN_IN') {
                return argument.extension.status;
            }
        }
        return null;
    }

    /**
     * Returns user object
     * @return {*}
     */
    getUser() {
        return _.get(this, 'user');
    }

    /**
     * Returns user object
     * @return {*}
     */
    getUserObject() {
        return _.get(this, 'user');
    }

    /**
     * Returns user object
     * @return {*}
     */
    getUserProfile() {
        const defaultValue = {};
        return _.get(this, 'user.profile', defaultValue);
    }

    /**
     * Returns user id
     * @return {*}
     */
    getUserId() {
        return _.get(this, 'user.userId');
    }

    /**
     * Returns user permissions
     * @return {*}
     */
    getUserPermissions() {
        return _.get(this, 'user.permissions');
    }

    /**
     * Returns user last seen
     * @return {*}
     */
    getUserLastSeen() {
        return _.get(this, 'user.lastSeen');
    }

    /**
     * Returns user's access token
     * @return {string} accessToken
     */
    getAccessToken() {
        const defaultValue = '';
        return _.get(this, 'user.accessToken', defaultValue);
    }

    /**
     * Sets user's access token
     * @param {string} accessToken
     */
    setAccessToken(accessToken) {
        _.set(this, 'user.accessToken', accessToken);
    }

    /**
     * Returns permissions granted by the user
     * @return {array} permissions
     */
    getGrantedPermissions() {
        const defaultValue = [];
        return _.get(this, 'user.permissions', defaultValue);
    }

    /**
     * Returns user locale
     * @return {*}
     */
    getUserLocale() {
        return _.get(this, 'user.locale');
    }

    /**
     * Returns user locale
     * @return {*}
     */
    getLocale() {
        return this.getUserLocale();
    }

    /**
     * Returns device's information
     * @return {object} device
     */
    getDevice() {
        const defaultValue = {};

        return _.get(this, 'device', defaultValue);
    }

    /**
     * Returns device's information
     * @return {object} device
     */
    getDeviceObject() {
        return this.getDevice();
    }

    /**
     * Returns device's coordinates
     * @return {object} coordinates
     */
    getCoordinates() {
        const defaultValue = {};

        return _.get(this.getDevice(), 'location.coordinates', defaultValue);
    }

    /**
     * Returns device's latitude
     * @return {string} latitude
     */
    getDeviceLatitude() {
        const defaultValue = '';

        return _.get(this.getDevice(), 'location.coordinates.latitude', defaultValue);
    }

    /**
     * Returns device's longitude
     * @return {string} longitude
     */
    getDeviceLongitude() {
        const defaultValue = '';

        return _.get(this.getDevice(), 'location.coordinates.longitude', defaultValue);
    }

    /**
     * Returns device's formatted address
     * @return {object} address
     */
    getDeviceFormattedAddress() {
        const defaultValue = '';

        return _.get(this.getDevice(), 'location.formatted_address', defaultValue);
    }

    /**
     * Returns device's zip code
     * @return {object} zip_code
     */
    getDeviceZipCode() {
        const defaultValue = '';

        return _.get(this.getDevice(), 'location.zip_code', defaultValue);
    }

    /**
     * Returns device's city
     * @return {object} city
     */
    getDeviceCity() {
        const defaultValue = '';

        return _.get(this.getDevice(), 'location.city', defaultValue);
    }

    /**
     * (Backwards compability)
     * Returns device's capabilities
     * @return {array} capabilities
     */
    getDeviceCapabilities() {
        return this.getSurfaceCapabilities();
    }

    /**
     * Returns conversation object
     * @return {*}
     */
    getConversation() {
        return _.get(this, 'conversation');
    }

    /**
     * Returns conversation id
     * @return {*}
     */
    getConversationId() {
        return _.get(this, 'conversation.conversationId');
    }

    /**
     * Returns conversation type
     * @return {*}
     */
    getConversationType() {
        return _.get(this, 'conversation.type');
    }

    /**
     * Returns inputs array
     * @return {Array}
     */
    getInputs() {
        return _.get(this, 'inputs');
    }

    /**
     * Returns media status
     * @return {*|string|boolean|any|number}
     */
    getMediaStatus() {
        if (this.getIntent() === 'actions.intent.MEDIA_STATUS') {
            for (let arg of _.get(this, 'inputs[0].arguments')) {
                if (arg.name === 'MEDIA_STATUS') {
                    return arg.extension.status;
                }
            }
        }
    }

    /**
     * Returns n-th intent in inputs array
     * @param {int} index
     * @return {*}
     */
    getIntent(index) {
        if (typeof index === 'undefined') {
            index = 0;
        }
        return _.get(this, 'inputs[' + index + '].intent');
    }

    /**
     * Returns n-th raw input in inputs array
     * @param {int=} index
     * @return {*}
     */
    getRawInputs(index) {
        if (typeof index === 'undefined') {
            index = 0;
        }
        return _.get(this, 'inputs[' + index + '].rawInputs');
    }

    /**
     * Returns raw input type
     * TODO: more than one input possible?
     * @return {string}
     */
    getRawInputType() {
        return _.get(this, 'inputs[0].rawInputs[0].inputType');
    }

    /**
     * Returns raw input type
     * TODO: more than one input possible?
     * @return {string}
     */
    getRawInputQuery() {
        return _.get(this, 'inputs[0].rawInputs[0].query');
    }

    /**
     * Returns surface object
     * @return {*}
     */
    getSurface() {
        return _.get(this, 'surface');
    }

    /**
     * Returns surface capabilities
     * @return {Array}
     */
    getSurfaceCapabilities() {
        return _.get(this, 'surface.capabilities');
    }

    /**
     * Return true if in sandbox mode
     * @return {boolean}
     */
    isInSandbox() {
        return _.get(this, 'isInSandbox');
    }

    /**
     * Returns available surfaces
     * @return {*}
     */
    getAvailableSurfaces() {
        return _.get(this, 'availableSurfaces');
    }

    /**
     * Sets conversation object
     * @param {*} conversation
     * @return {GoogleActionRequest}
     */
    setConversation(conversation) {
        _.set(this, 'conversation', conversation);
        return this;
    }

    /**
     * Sets conversations id
     * @param {string} conversationId
     * @return {GoogleActionRequest}
     */
    setConversationId(conversationId) {
        _.set(this, 'conversation.conversationId', conversationId);
        return this;
    }

    /**
     * Sets conversations type
     * @param {string} type
     * @return {GoogleActionRequest}
     */
    setConversationType(type) {
        _.set(this, 'conversation.type', type);
        return this;
    }

    /**
     * Sets user object
     * @param {*} user
     * @return {GoogleActionRequest}
     */
    setUser(user) {
        _.set(this, 'user', user);
        return this;
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {GoogleActionRequest}
     */
    setUserId(userId) {
        _.set(this, 'user.userId', userId);
        return this;
    }

    /**
     * Sets user locale
     * @param {string} locale
     * @return {GoogleActionRequest}
     */
    setUserLocale(locale) {
        _.set(this, 'user.locale', locale);
        return this;
    }

    /**
     * Sets inputs array
     * @param {Array<*>} inputs
     * @return {GoogleActionRequest}
     */
    setInputs(inputs) {
        _.set(this, 'inputs', inputs);
        return this;
    }

    /**
     * Sets surface object
     * @param {*} surface
     * @return {GoogleActionRequest}
     */
    setSurface(surface) {
        _.set(this, 'surface', surface);
        return this;
    }


    /**
     * Sets screen surface properties
     * @return {GoogleActionRequest}
     */
    setScreenSurface() {
        return this.setSurface( {
            'capabilities': [
                {
                    'name': 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    'name': 'actions.capability.SCREEN_OUTPUT',
                },
                {
                    'name': 'actions.capability.AUDIO_OUTPUT',
                },
                {
                    'name': 'actions.capability.WEB_BROWSER',
                },
            ],
        });
    }

    /**
     * Sets audio surface properties
     * @return {GoogleActionRequest}
     */
    setAudioSurface() {
        return this.setSurface({
            'capabilities': [
                {
                    'name': 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    'name': 'actions.capability.AUDIO_OUTPUT',
                },
            ],
        });
    }

    /**
     * Sets isInSandbox
     * @param {boolean} isInSandbox
     * @return {GoogleActionRequest}
     */
    setIsInSandbox(isInSandbox) {
        _.set(this, 'isInSandbox', isInSandbox);
        return this;
    }

    /**
     * Set isNewSession
     * @param {boolean} isNewSession
     * @return {Object}
     */
    setSessionNew(isNewSession) {
        let newSession = 'NEW';

        if (typeof isNewSession !== 'undefined' && isNewSession === false) {
            newSession = 'ACTIVE';
        }
        return _.set(this, 'conversation.type', newSession);
    }

    /**
     * Returns sessions new value
     * @return {boolean}
     */
    getSessionNew() {
        if (_.get(this, 'conversation.type') === 'ACTIVE') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Sets available surfaces array
     * @param {*} availableSurfaces
     * @return {GoogleActionRequest}
     */
    setAvailableSurfaces(availableSurfaces) {
        _.set(this, 'availableSurfaces', availableSurfaces);
        return this;
    }

    /**
     * Returns this (compatibility with dialog flow classes)
     * @return {GoogleActionRequest}
     */
    getOriginalRequest() {
        return this;
    }

    /**
     * Returns google action request
     * @return {GoogleActionRequest}
     */
    getGoogleActionRequest() {
        return this;
    }
}

module.exports.GoogleActionRequest = GoogleActionRequest;
