"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const google_assistant_enums_1 = require("./google-assistant-enums");
const GoogleActionSpeechBuilder_1 = require("./GoogleActionSpeechBuilder");
const GoogleActionUser_1 = require("./GoogleActionUser");
const _get = require("lodash.get");
const _sample = require('lodash.sample');
class GoogleAction extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$googleAction = this;
        this.$speech = new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(this);
        this.$reprompt = new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(this);
        this.$user = new GoogleActionUser_1.GoogleActionUser(this);
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
        this.$output.ask = {
            speech: speech.toString(),
            reprompt: reprompt.toString(),
        };
        if (reprompts) {
            this.$output.ask.reprompt = [reprompt.toString()];
            reprompts.forEach((repr) => {
                this.$output.ask.reprompt.push(repr.toString());
            });
        }
        return this;
    }
    hasWebBrowserInterface() {
        const currentDialogflowRequest = this.$request;
        const currentGoogleActionRequest = currentDialogflowRequest.originalDetectIntentRequest
            .payload;
        return currentGoogleActionRequest.hasWebBrowserInterface();
    }
    hasScreenInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return (typeof _get(this.$originalRequest || this.$request, 'surface.capabilities').find((item) => item.name === 'actions.capability.SCREEN_OUTPUT') !== 'undefined');
    }
    hasAudioInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return (typeof _get(this.$originalRequest || this.$request, 'surface.capabilities').find((item) => item.name === 'actions.capability.AUDIO_OUTPUT') !== 'undefined');
    }
    hasMediaResponseInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return (typeof _get(this.$originalRequest || this.$request, 'surface.capabilities').find((item) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO') !== 'undefined');
    }
    hasInteractiveCanvasInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return (typeof _get(this.$originalRequest || this.$request, 'surface.capabilities').find((item) => item.name === 'actions.capability.INTERACTIVE_CANVAS') !== 'undefined');
    }
    getAvailableSurfaces() {
        if (!_get(this.$originalRequest || this.$request, 'availableSurfaces[0].capabilities')) {
            return [];
        }
        return _get(this.$originalRequest || this.$request, 'availableSurfaces[0].capabilities').map((item) => item.name);
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
        return (_get(this.$originalRequest || this.$request, 'inputs[0].arguments[0].rawText') ||
            _get(this.$originalRequest || this.$request, 'inputs[0].rawInputs[0].query'));
    }
    getAudioData() {
        return undefined;
    }
    isInSandbox() {
        return _get(this.$originalRequest || this.$request, 'isInSandbox', false);
    }
    isVerifiedUser() {
        return (_get(this.$originalRequest || this.$request, 'user.userVerificationStatus') === 'VERIFIED');
    }
    addOutputContext(name, parameters, lifespanCount = 1) {
        if (!this.$output.Dialogflow) {
            this.$output.Dialogflow = {};
        }
        if (!this.$output.Dialogflow.OutputContexts) {
            this.$output.Dialogflow.OutputContexts = [];
        }
        this.$output.Dialogflow.OutputContexts.push({
            name,
            parameters,
            lifespanCount,
        });
    }
    getOutputContext(name) {
        return _get(this.$request, 'queryResult.outputContexts', []).find((context) => {
            return context.name.indexOf(`/contexts/${name}`) > -1;
        });
    }
    isSignInRequest() {
        return this.$type.type === google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_SIGN_IN;
    }
    isPermissionRequest() {
        return this.$type.type === google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION;
    }
    isConfirmationRequest() {
        return this.$type.type === google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_CONFIRMATION;
    }
    isDateTimeRequest() {
        return this.$type.type === google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_DATETIME;
    }
    isPlaceRequest() {
        return this.$type.type === google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PLACE;
    }
    getProjectId() {
        let sessionId = _get(this.$request, 'session');
        sessionId = sessionId.substring(9, sessionId.indexOf('/agent/'));
        return sessionId;
    }
}
exports.GoogleAction = GoogleAction;
//# sourceMappingURL=GoogleAction.js.map