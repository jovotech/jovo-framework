"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class AutopilotRequest {
    /* tslint:enable:variable-name */
    getUserId() {
        return this.UserIdentifier;
    }
    getRawText() {
        return this.CurrentInput;
    }
    getTimestamp() {
        return new Date().toISOString();
    }
    getDeviceName() {
        return undefined;
    }
    getAccessToken() {
        return undefined;
    }
    // platform only supports `en-US` as of 17.11.2019
    getLocale() {
        return 'en-US';
    }
    isNewSession() {
        return false;
    }
    hasAudioInterface() {
        // TODO: maybe we could determine that using the `Channel` property
        return false;
    }
    hasScreenInterface() {
        // TODO: same as audio interface
        return false;
    }
    hasVideoInterface() {
        return false;
    }
    getSessionAttributes() {
        return this.getSessionData();
    }
    // tslint:disable-next-line:no-any
    addSessionAttribute(key, value) {
        return this.addSessionData(key, value);
    }
    getSessionData() {
        return this.Memory ? JSON.parse(this.Memory) : {};
    }
    // tslint:disable-next-line:no-any
    addSessionData(key, value) {
        const memory = this.Memory ? JSON.parse(this.Memory) : {};
        memory[key] = value;
        this.Memory = JSON.stringify(memory);
        return this;
    }
    setTimestamp(timestamp) {
        return this;
    }
    setLocale(locale) {
        return this;
    }
    setUserId(userId) {
        this.UserIdentifier = userId;
        return this;
    }
    setAccessToken(accessToken) {
        return this;
    }
    setNewSession(isNew) {
        return this;
    }
    setAudioInterface() {
        return this;
    }
    setScreenInterface() {
        return this;
    }
    setVideoInterface() {
        return this;
    }
    setSessionAttributes(attributes) {
        return this.setSessionData(attributes);
    }
    setSessionData(sessionData) {
        this.Memory = JSON.stringify(sessionData);
        return this;
    }
    setState(state) {
        const memory = this.Memory ? JSON.parse(this.Memory) : {};
        memory[jovo_core_1.SessionConstants.STATE] = state;
        this.Memory = JSON.stringify(memory);
        return this;
    }
    getIntentName() {
        return this.CurrentTask;
    }
    getCurrentTaskConfidence() {
        return this.CurrentTaskConfidence;
    }
    getNextBestTask() {
        return this.NextBestTask;
    }
    setIntentName(intentName) {
        this.CurrentTask = intentName;
        return this;
    }
    setSessionId(id) {
        this.DialogueSid = id;
        return this;
    }
    setNextBestTask(task) {
        this.NextBestTask = task;
        return this;
    }
    setCurrentTaskConfidence(confidence) {
        this.CurrentTaskConfidence = confidence;
        return this;
    }
    getInputs() {
        const inputs = {};
        /**
         * Autopilot includes all the fields (inputs) on the root level of the request.
         * Each field has two key-value pairs on root:
         * Field_{field-name}_Value: string; &
         * Field_{field-name}_Type: string;
         * We extract these two values for each of the fields and save them inside the inputs object
         */
        Object.keys(this).forEach((key) => {
            if (key.includes('Field')) {
                const fieldName = getFieldNameFromKey(key);
                if (inputs[fieldName]) {
                    // field was already parsed
                    return;
                }
                const field = {
                    name: fieldName,
                    type: this[`Field_${fieldName}_Type`],
                    value: this[`Field_${fieldName}_Value`],
                };
                inputs[fieldName] = field;
            }
        });
        return inputs;
    }
    addInput(key, value) {
        if (typeof value === 'string') {
            this[`Field_${key}_Value`] = value;
        }
        else {
            this[`Field_${key}_Type`] = value.type;
            this[`Field_${key}_Value`] = value.value;
        }
        return this;
    }
    getState() {
        const memory = this.Memory ? JSON.parse(this.Memory) : {};
        return memory[jovo_core_1.SessionConstants.STATE];
    }
    setInputs(inputs) {
        Object.entries(inputs).forEach(([name, input]) => {
            this.addInput(name, input);
        });
        return this;
    }
    getSessionId() {
        return this.DialogueSid;
    }
    toJSON() {
        return Object.assign({}, this);
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            json = decodeURIComponent(json);
            return JSON.parse(json);
        }
        else {
            const request = Object.create(AutopilotRequest.prototype);
            Object.assign(request, json);
            Object.entries(request).forEach(([key, value]) => {
                request[key] = decodeURIComponent(value);
            });
            return request;
        }
    }
}
exports.AutopilotRequest = AutopilotRequest;
/**
 * Returns field name from key,
 * e.g. returns `field-name` from `Field_{field-name}_Value`
 * @param {string} key
 * @returns {string}
 */
function getFieldNameFromKey(key) {
    const firstUnderscoreIndex = key.indexOf('_');
    const lastUnderscoreIndex = key.lastIndexOf('_');
    return key.slice(firstUnderscoreIndex + 1, lastUnderscoreIndex);
}
//# sourceMappingURL=AutopilotRequest.js.map