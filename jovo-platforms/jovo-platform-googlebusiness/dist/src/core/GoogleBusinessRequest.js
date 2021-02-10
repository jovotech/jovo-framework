"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class GoogleBusinessRequest {
    constructor() {
        this.agent = '';
        this.conversationId = '';
        this.customAgentId = '';
        this.requestId = '';
        this.sendTime = '';
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, GoogleBusinessRequest.reviver);
        }
        else {
            const corePlatformRequest = Object.create(GoogleBusinessRequest.prototype);
            return Object.assign(corePlatformRequest, json);
        }
    }
    // tslint:disable-next-line:no-any
    static reviver(key, value) {
        return key === '' ? GoogleBusinessRequest.fromJSON(value) : value;
    }
    toJSON() {
        return Object.assign({}, this);
    }
    /**
     * Returns the agent identifier.
     */
    getAgent() {
        return this.agent;
    }
    /**
     * Returns the custom agent identifier
     */
    getCustomAgentId() {
        return this.customAgentId;
    }
    /**
     * Return the request ID
     */
    getRequestId() {
        return this.requestId;
    }
    getRawText() {
        var _a, _b, _c;
        return (((_a = this.message) === null || _a === void 0 ? void 0 : _a.text) || ((_b = this.suggestionResponse) === null || _b === void 0 ? void 0 : _b.postbackData) || ((_c = this.suggestionResponse) === null || _c === void 0 ? void 0 : _c.text) ||
            '');
    }
    /**
     * Returns the entry point that the user clicked to initiate the conversation.
     *
     * Either `ENTRY_POINT_UNSPECIFIED`, `PLACESHEET`, or `MAPS` if it is defined in the request.
     */
    getEntryPoint() {
        var _a;
        return (_a = this.context) === null || _a === void 0 ? void 0 : _a.entryPoint;
    }
    /**
     * Returns the ID from the Google Places database for the location the user messaged.
     */
    getPlaceId() {
        var _a;
        return (_a = this.context) === null || _a === void 0 ? void 0 : _a.placeId;
    }
    /**
     * Returns the user's display name.
     */
    getUserDisplayName() {
        var _a;
        return (_a = this.context) === null || _a === void 0 ? void 0 : _a.userInfo.displayName;
    }
    getDeviceName() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse a device name in the request.");
        return;
    }
    getUserId() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse an user ID in the request. Please use this.$user.getId()");
        return '';
    }
    getAccessToken() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse an access token in the request.");
        return;
    }
    getLocale() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse a locale in the request.");
        return '';
    }
    isNewSession() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse a flag for new sessions in the request. Please use this.isNewSession() instead.");
        return false;
    }
    getTimestamp() {
        return this.sendTime;
    }
    hasAudioInterface() {
        jovo_core_1.Log.warn("Google Business Messages doesn't support multiple interfaces.");
        return false;
    }
    hasScreenInterface() {
        jovo_core_1.Log.warn("Google Business Messages doesn't support multiple interfaces.");
        return false;
    }
    hasVideoInterface() {
        jovo_core_1.Log.warn("Google Business Messages doesn't support multiple interfaces.");
        return false;
    }
    getSessionAttributes() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse session data in the request. Please use this.$session");
        return {};
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    addSessionAttribute(key, value) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse session data in the request. Please use this.$session");
        return this;
    }
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    setTimestamp(timestamp) {
        this.sendTime = timestamp;
        return this;
    }
    setLocale(locale) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse a locale in the request.");
        return this;
    }
    setUserId(userId) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse an user ID in the request.");
        return this;
    }
    setAccessToken(accessToken) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse an access token in the request.");
        return this;
    }
    setNewSession(isNew) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse a flag for new sessions in the request. Simply use a unique conversationId in your request instead.");
        return this;
    }
    setAudioInterface() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse the interfaces of the current device in the request.");
        return this;
    }
    setVideoInterface() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse the interfaces of the current device in the request.");
        return this;
    }
    setScreenInterface() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse the interfaces of the current device in the request.");
        return this;
    }
    setSessionAttributes(attributes) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse session data in the request. Please use this.$session");
        return this;
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    setState(state) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse state data in the request. Please use this.setState() instead.");
        return this;
    }
    getIntentName() {
        var _a;
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            return ((_a = this.nlu) === null || _a === void 0 ? void 0 : _a.intentName) || '';
        }
        else {
            jovo_core_1.Log.warn("Google Business Messages doesn't parse an intent in the request. Please use $googleBusinessBot.$nlu.intent.name to get the intent name");
            return '';
        }
    }
    setIntentName(intentName) {
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            if (!this.nlu) {
                this.nlu = {};
            }
            this.nlu.intentName = intentName;
        }
        else {
            jovo_core_1.Log.warn("Google Business Messages doesn't parse the intent in the request. Please use this.$nlu.intent.name to set the intent name.");
        }
        return this;
    }
    getInputs() {
        var _a;
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            return ((_a = this.nlu) === null || _a === void 0 ? void 0 : _a.inputs) || {};
        }
        else {
            jovo_core_1.Log.warn("Google Business Messages doesn't parse inputs in the request. Please use this.$inputs to get the inputs directly");
            return {};
        }
    }
    addInput(key, value) {
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            if (!this.nlu) {
                this.nlu = {};
            }
            if (!this.nlu.inputs) {
                this.nlu.inputs = {};
            }
            if (typeof value === 'string') {
                this.nlu.inputs[key] = {
                    name: key,
                    value,
                };
            }
            else {
                this.nlu.inputs[key] = value;
            }
        }
        else {
            jovo_core_1.Log.warn("Google Business Messages doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly");
        }
        return this;
    }
    getState() {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse state data in the request. Please use this.setState() instead.");
        return;
    }
    setInputs(inputs) {
        jovo_core_1.Log.warn("Google Business Messages doesn't parse inputs in the request. Please use this.$inputs to assign the inputs directly");
        return this;
    }
    getSessionId() {
        return this.conversationId;
    }
    setSessionId(id) {
        this.conversationId = id;
        return this;
    }
}
exports.GoogleBusinessRequest = GoogleBusinessRequest;
//# sourceMappingURL=GoogleBusinessRequest.js.map