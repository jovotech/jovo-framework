'use strict';

const GoogleActionRequest = require('./googleActionRequest').GoogleActionRequest;
const DialogFlowRequest = require('./dialogFlowRequest').DialogFlowRequest;
const Jovo = require('../../../jovo');

/**
 * Google Action request where Google Actions request is handled via Dialog Flow
 */
class GoogleActionDialogFlowRequest extends DialogFlowRequest {
    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
        this.originalRequest.data = new GoogleActionRequest(request.originalRequest.data);
    }

    /**
     * Returns google action request
     * @return {GoogleActionRequest}
     */
    getGoogleActionRequest() {
        return new GoogleActionRequest(this.originalRequest.data);
    }

    /**
     * Returns original request object
     * @return {*} original request object
     */
    getOriginalRequest() {
        return this.originalRequest;
    }


    /**
     * Jovo implementations ---------------------
     */

    /**
     * Returns user id
     * @return {string}
     */
    getUserId() {
        return this.getGoogleActionRequest().getUserId();
    }

    /**
     * Returns locale
     * @return {String}
     */
    getLocale() {
        return this.getGoogleActionRequest().getLocale();
    }

    /**
     * Returns access token
     * @return {string}
     */
    getAccessToken() {
        return this.getGoogleActionRequest().getAccessToken();
    }

    /**
     * Returns true if session is new
     * @return {boolean}
     */
    isNewSession() {
        return this.getGoogleActionRequest().getConversationType() === 'NEW';
    }

    /**
     * Returns timestamp
     * @return {string}
     */
    getTimestamp() {
        return this.getTimestamp();
    }

    /**
     * Returns raw text
     * @return {string}
     */
    getRawText() {
        return this.getGoogleActionRequest().getRawText();
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
        if (this.getGoogleActionRequest()
                .isOptionsIntent()) {
            return Jovo.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
        }
        if (this.getGoogleActionRequest()
                .isSignInIntent()) {
            return Jovo.REQUEST_TYPE_ENUM.ON_SIGN_IN;
        }

        if (this.getGoogleActionRequest()
                .isPermissionIntent()) {
            return Jovo.REQUEST_TYPE_ENUM.ON_PERMISSION;
        }

        if (this.getGoogleActionRequest()
                .isCancelIntent()) {
            return Jovo.REQUEST_TYPE_ENUM.END;
        }
        // TODO: test with input.welcome
        if (this.getResolvedQuery() === 'GOOGLE_ASSISTANT_WELCOME') {
            return Jovo.REQUEST_TYPE_ENUM.LAUNCH;
        }
        return Jovo.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Returns true if device has an audio interface
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.getGoogleActionRequest().hasAudioInterface();
    }

    /**
     * Returns true if device has an screen interface
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.getGoogleActionRequest().hasScreenInterface();
    }

    /**
     * Returns user object from request
     * @return {*}
     */
    getUser() {
        return this.getGoogleActionRequest().getUser();
    }

    /**
     * Returns device object from request
     * @return {*}
     */
    getDevice() {
        return this.getGoogleActionRequest().getDevice();
    }
    /**
     * NLU data
     */
    // getIntentName
}

module.exports.GoogleActionDialogFlowRequest = GoogleActionDialogFlowRequest;
