"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const AutopilotSpeechBuilder_1 = require("./AutopilotSpeechBuilder");
const AutopilotResponse_1 = require("./AutopilotResponse");
class AutopilotBot extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$autopilotBot = this;
        this.$response = new AutopilotResponse_1.AutopilotResponse();
        this.$speech = new AutopilotSpeechBuilder_1.AutopilotSpeechBuilder(this);
        // $reprompt object has to be added even if the platform doesn't use it.
        // Is used by users as platform independent feature
        this.$reprompt = new AutopilotSpeechBuilder_1.AutopilotSpeechBuilder(this);
        this.$output.Autopilot = {};
    }
    isNewSession() {
        // undefined if no active DB
        if (this.$user.$session) {
            return this.$user.$session.id !== this.$request.getSessionId();
        }
        else {
            return false;
        }
    }
    hasAudioInterface() {
        return this.$request.hasAudioInterface();
    }
    hasScreenInterface() {
        return this.$request.hasScreenInterface();
    }
    hasVideoInterface() {
        return this.$request.hasVideoInterface();
    }
    getSpeechBuilder() {
        return new AutopilotSpeechBuilder_1.AutopilotSpeechBuilder(this);
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getDeviceId() {
        return undefined;
    }
    getRawText() {
        const request = this.$request;
        return request.getRawText();
    }
    getTimestamp() {
        return this.$request.getTimestamp();
    }
    getLocale() {
        return this.$request.getLocale();
    }
    getType() {
        return 'AutopilotBot';
    }
    getPlatformType() {
        return 'Autopilot';
    }
    getSelectedElementId() {
        return undefined;
    }
    setActions(actions) {
        const response = this.$response;
        response.actions = actions;
        return this;
    }
    getAudioData() {
        return undefined;
    }
}
exports.AutopilotBot = AutopilotBot;
//# sourceMappingURL=AutopilotBot.js.map