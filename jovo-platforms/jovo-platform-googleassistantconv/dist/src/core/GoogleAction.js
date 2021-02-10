"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const ConversationalActionRequest_1 = require("./ConversationalActionRequest");
const ConversationalActionUser_1 = require("./ConversationalActionUser");
const ConversationalActionResponse_1 = require("./ConversationalActionResponse");
const GoogleActionSpeechBuilder_1 = require("./GoogleActionSpeechBuilder");
const _set = require("lodash.set");
const ConversationalScene_1 = require("./ConversationalScene");
const _sample = require('lodash.sample');
class GoogleAction extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$conversationalSession = {};
        this.$googleAction = this;
        this.$speech = new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(this);
        this.$reprompt = new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(this);
        this.$output.GoogleAssistant = {};
        this.$request = ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(this.$host.getRequestObject());
        this.$response = new ConversationalActionResponse_1.ConversationalActionResponse();
        this.$user = new ConversationalActionUser_1.ConversationalActionUser(this);
        const scene = this.$request.scene;
        if (scene) {
            this.$scene = new ConversationalScene_1.ConversationalScene(scene);
        }
    }
    getLocale() {
        return this.$request.getLocale();
    }
    getTimestamp() {
        return this.$request.getTimestamp();
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getSpeechBuilder() {
        return new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(this);
    }
    isNewSession() {
        return this.$request.isNewSession();
    }
    ask(speech, reprompt, ...reprompts) {
        delete this.$output.tell;
        if (Array.isArray(speech)) {
            speech = _sample(speech);
        }
        if (Array.isArray(reprompt)) {
            reprompt = _sample(reprompt);
        }
        if (!reprompt) {
            reprompt = speech;
        }
        _set(this.$output, 'ask.speech', speech.toString());
        _set(this.$output, 'ask.reprompt', reprompt.toString());
        if (reprompts) {
            this.$output.ask.reprompt = [reprompt.toString()];
            reprompts.forEach((repr) => {
                this.$output.ask.reprompt.push(repr.toString());
            });
        }
        return this;
    }
    hasWebBrowserInterface() {
        return this.$request.hasWebBrowserInterface();
    }
    hasScreenInterface() {
        return this.$request.hasScreenInterface();
    }
    hasAudioInterface() {
        return this.$request.hasAudioInterface();
    }
    hasLongFormAudioInterface() {
        const request = this.$request;
        if (request.device) {
            return !!request.device.capabilities.find((cap) => cap === 'LONG_FORM_AUDIO');
        }
    }
    setNextScene(scene) {
        _set(this.$output, 'GoogleAssistant.nextScene', scene);
        return this;
    }
    endConversation() {
        this.setNextScene('actions.scene.END_CONVERSATION');
        return this;
    }
    endSession() {
        return this.endConversation();
    }
    hasInteractiveCanvasInterface() {
        const request = this.$request;
        if (request.device) {
            return !!request.device.capabilities.find((cap) => cap === 'INTERACTIVE_CANVAS');
        }
    }
    getAvailableSurfaces() {
    }
    hasVideoInterface() {
        return false;
    }
    getDeviceId() {
        return undefined;
    }
    getType() {
        return 'GoogleAction';
    }
    getPlatformType() {
        return 'GoogleAssistant';
    }
    getRawText() {
        var _a;
        const request = this.$request;
        return (_a = request.intent) === null || _a === void 0 ? void 0 : _a.query;
    }
    getAudioData() {
        return undefined;
    }
    isInSandbox() {
        throw new Error('Not supported anymore');
    }
    isVerifiedUser() {
        var _a;
        const request = this.$request;
        return ((_a = request.user) === null || _a === void 0 ? void 0 : _a.verificationStatus) === 'VERIFIED';
    }
    getSelectedElementId() {
        var _a, _b, _c;
        const request = this.$request;
        return (_c = (_b = (_a = request.intent) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.prompt_option) === null || _c === void 0 ? void 0 : _c.resolved;
    }
    getProjectId() {
        const queryParams = this.$host.getQueryParams();
        return queryParams['projectId'];
    }
    hasMediaResponseInterface() {
        return this.$request.hasLongFormAudioInterface();
    }
    showSuggestions(suggestions) {
        const suggestionsList = suggestions.map((item) => {
            return {
                title: item,
            };
        });
        _set(this.$output, 'GoogleAssistant.suggestions', suggestionsList);
    }
    isAccountLinkingRejected() {
        var _a, _b, _c;
        return (((_c = (_b = (_a = this.$request.intent) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.AccountLinkingSlot) === null || _c === void 0 ? void 0 : _c.resolved) === 'REJECTED');
    }
    isAccountLinkingLinked() {
        var _a, _b, _c;
        return (((_c = (_b = (_a = this.$request.intent) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.AccountLinkingSlot) === null || _c === void 0 ? void 0 : _c.resolved) === 'LINKED');
    }
    getPermissionResult() {
        for (const [key, value] of Object.entries(this.$request.intent.params)) {
            if (key.startsWith('NotificationsSlot_')) {
                return value.resolved;
            }
        }
    }
    getPermissionStatus() {
        var _a;
        return (_a = this.getPermissionResult()) === null || _a === void 0 ? void 0 : _a.permissionStatus;
    }
    isPermissionDenied() {
        return this.getPermissionStatus() === 'PERMISSION_DENIED';
    }
    isPermissionGranted() {
        return this.getPermissionStatus() === 'PERMISSION_GRANTED';
    }
    isPermissionAlreadyGranted() {
        return this.getPermissionStatus() === 'ALREADY_GRANTED';
    }
    getNotificationsUserId() {
        var _a;
        return (_a = this.getPermissionResult()) === null || _a === void 0 ? void 0 : _a.additionalUserData.updateUserId;
    }
    prompt(prompt) {
        this.$output.GoogleAssistant.prompt = prompt;
        return this;
    }
    showAccountLinkingCard() {
        throw new Error('Not supported in Google Assistant Conversational Actions. ');
    }
    promptAsk(prompt, ...reprompts) {
        this.$output.GoogleAssistant.askPrompt = {
            prompt,
            reprompts,
        };
        return this;
    }
    addSessionEntityTypes(sessionEntityTypes) {
        throw new Error(`Not supported in Google Assistant Conversational Actions. Please use addTypeOverrides(typeOverrides: TypeOverride[])`);
    }
    addSessionEntityType(sessionEntityType) {
        return this.addSessionEntityTypes(sessionEntityType);
    }
    addSessionEntity(sessionEntity) {
        return this.addSessionEntityTypes(sessionEntity);
    }
    setExpected(expectedSpeech, languageCode) {
        this.$output.GoogleAssistant.expected = {
            speech: expectedSpeech,
            languageCode: languageCode || this.$request.getLocale(),
        };
    }
}
exports.GoogleAction = GoogleAction;
//# sourceMappingURL=GoogleAction.js.map