"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _set = require("lodash.set");
const DialogflowUser_1 = require("./DialogflowUser");
class DialogflowAgent extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$dialogflowAgent = this;
        this.$user = new DialogflowUser_1.DialogflowUser(this);
    }
    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @return {string}
     */
    getLocale() {
        return this.$request.getLocale();
    }
    /**
     * Returns timestamp of a user's request
     * @return {string | undefined}
     */
    getTimestamp() {
        return this.$request.getTimestamp();
    }
    // dialogflowAgent(): DialogflowAgent {
    //     return this;
    // }
    /**
     * Returns source of request payload
     */
    getSource() {
        return _get(this.$request, 'originalDetectIntentRequest.source');
    }
    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession() {
        return this.$request.isNewSession();
    }
    /**
     * Google Assistant doesn't return a device id
     * @return {string | undefined}
     */
    getDeviceId() {
        return undefined;
    }
    /**
     * Returns raw text of request.
     * @return {string | undefined}
     */
    getRawText() {
        return _get(this.$request, 'queryResult.queryText');
    }
    /**
     * Returns audio data of request.
     * Not supported by this platform.
     * @return {undefined}
     */
    getAudioData() {
        return undefined;
    }
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder() {
        return new jovo_core_1.SpeechBuilder(this);
    }
    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        return false;
    }
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        return false;
    }
    /**
     * Returns video capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return false;
    }
    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return 'DialogflowAgent';
    }
    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType() {
        return 'Dialogflow';
    }
    /**
     * Returs id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        return undefined;
    }
    setCustomPayload(platform, payload) {
        _set(this.$output, 'Dialogflow.Payload.' + platform, payload);
    }
}
exports.DialogflowAgent = DialogflowAgent;
//# sourceMappingURL=DialogflowAgent.js.map