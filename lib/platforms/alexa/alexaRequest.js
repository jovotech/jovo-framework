'use strict';

/**
 * AlexaRequest Class
 */
class AlexaRequest {
    /**
     * Constructor
     * @param {{}} requestObj
     */
    constructor(requestObj) {
        this.requestObj = requestObj;
    }

    /**
     * Returns unique user id
     *
     * @return {string} UserId
     */
    getUserId() {
        if (this.requestObj.session) {
            return this.requestObj.session.user.userId;
        } else if (this.requestObj.context.System) {
            return this.requestObj.context.System.user.userId;
        }
    }
    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return this.requestObj.request.intent.name;
    }

    /**
     * Returns session attribute value
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        if (!this.requestObj.session.attributes) {
            return;
        }
        return this.requestObj.session.attributes[name];
    }
    /**
     * Returns all session attributes
     * @return {*}
     */
    getSessionAttributes() {
        return this.requestObj.session.attributes;
    }

    /**
     * Returns session object of request
     * @return {*}
     */
    getSession() {
        return this.requestObj.session;
    }

    /**
     * Returns application ID (Skill ID) of the request
     * @return {String} applicationId
     */
    getApplicationId() {
        return this.requestObj.session.application.applicationId;
    }

    /**
     * Returns dialog state of request
     * @return {STARTED|IN_PROGRESS|COMPLETED}
     */
    getDialogState() {
        return this.requestObj.request.dialogState;
    }

    /**
     * Returns request type for
     * LaunchRequest, IntentRequest SessionEndedRequest
     * @return {string}
     */
    getRequestType() {
        return this.requestObj.request.type;
    }

    /**
     * Returns end reason
     * @return {string|*}
     */
    getEndReason() {
        return this.requestObj.request.reason;
    }

    /**
     * Returns intent slots of a request.
     * @return {*}
     */
    getSlots() {
        if (this.requestObj.request.intent.slots) {
            return this.requestObj.request.intent.slots;
        }
    }

    /**
     * Returns specific slot
     * @param {string} slotName
     * @return {*}
     */
    getSlot(slotName) {
        return this.getSlots()[slotName];
    }


    /**
     * Returns the confirmation status of a slot
     * @param {string} slotName
     * @return {*}
     */
    getSlotConfirmationStatus(slotName) {
        return this.getSlot(slotName).confirmationStatus;
    }

    /**
     * Returns request object
     * @return {*}
     */
    getRequestObect() {
        return this.requestObj;
    }

}


module.exports.AlexaRequest = AlexaRequest;
