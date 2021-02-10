"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const ActionBuilder_1 = require("../ActionBuilder");
const Interfaces_1 = require("../Interfaces");
const CorePlatformResponse_1 = require("./CorePlatformResponse");
const CorePlatformSpeechBuilder_1 = require("./CorePlatformSpeechBuilder");
const _get = require("lodash.get");
class CorePlatformApp extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$corePlatformApp = this;
        this.$response = new CorePlatformResponse_1.CorePlatformResponse();
        this.$speech = new CorePlatformSpeechBuilder_1.CorePlatformSpeechBuilder(this);
        this.$reprompt = new CorePlatformSpeechBuilder_1.CorePlatformSpeechBuilder(this);
        this.$actions = new ActionBuilder_1.ActionBuilder();
        this.$repromptActions = new ActionBuilder_1.ActionBuilder();
        this.$output[this.getPlatformType()] = {
            Actions: [],
            RepromptActions: [],
        };
    }
    getType() {
        return 'CorePlatformApp';
    }
    getPlatformType() {
        return 'CorePlatform';
    }
    getDeviceId() {
        return undefined;
    }
    getLocale() {
        return this.$request ? this.$request.getLocale() : undefined;
    }
    getRawText() {
        return _get(this, `$request.request.body.text`);
    }
    getAudioData() {
        return _get(this, `$request.request.body.audio`);
    }
    getSelectedElementId() {
        return undefined;
    }
    getTimestamp() {
        return this.$request ? this.$request.getTimestamp() : undefined;
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
    hasTextInput() {
        return this.$request.hasTextInput();
    }
    isNewSession() {
        return this.$request ? this.$request.isNewSession() : false;
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getSpeechBuilder() {
        return new CorePlatformSpeechBuilder_1.CorePlatformSpeechBuilder(this);
    }
    // Output methods
    setActions(actions) {
        this.$output[this.getPlatformType()].Actions =
            actions instanceof ActionBuilder_1.ActionBuilder ? actions.build() : actions;
        return this;
    }
    addActions(actions) {
        this.$output[this.getPlatformType()].Actions.push(...(actions instanceof ActionBuilder_1.ActionBuilder ? actions.build() : actions));
        return this;
    }
    setRepromptActions(actions) {
        this.$output[this.getPlatformType()].RepromptActions =
            actions instanceof ActionBuilder_1.ActionBuilder ? actions.build() : actions;
        return this;
    }
    addRepromptActions(actions) {
        this.$output[this.getPlatformType()].RepromptActions.push(...(actions instanceof ActionBuilder_1.ActionBuilder ? actions.build() : actions));
        return this;
    }
    showQuickReplies(replies) {
        this.$output[this.getPlatformType()].Actions.push({
            replies: replies.map((reply) => {
                return typeof reply === 'string'
                    ? {
                        id: reply,
                        label: reply,
                        value: reply,
                    }
                    : reply;
            }),
            type: Interfaces_1.ActionType.QuickReply,
        });
        return this;
    }
}
exports.CorePlatformApp = CorePlatformApp;
//# sourceMappingURL=CorePlatformApp.js.map