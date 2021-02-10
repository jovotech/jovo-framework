"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const GoogleBusiness_1 = require("../GoogleBusiness");
const GoogleBusinessAPI_1 = require("../services/GoogleBusinessAPI");
const GoogleBusinessResponse_1 = require("./GoogleBusinessResponse");
const GoogleBusinessSpeechBuilder_1 = require("./GoogleBusinessSpeechBuilder");
const GoogleBusinessUser_1 = require("./GoogleBusinessUser");
class GoogleBusinessBot extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$googleBusinessBot = this;
        this.$response = new GoogleBusinessResponse_1.GoogleBusinessResponse();
        this.$speech = new GoogleBusinessSpeechBuilder_1.GoogleBusinessSpeechBuilder(this);
        // $reprompt object has to be added even if the platform doesn't use it.
        // Is used by users as platform independent feature
        this.$reprompt = new GoogleBusinessSpeechBuilder_1.GoogleBusinessSpeechBuilder(this);
        this.$user = new GoogleBusinessUser_1.GoogleBusinessUser(this);
        this.$output.GoogleBusiness = {};
    }
    isNewSession() {
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
        return new GoogleBusinessSpeechBuilder_1.GoogleBusinessSpeechBuilder(this);
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getDeviceId() {
        jovo_core_1.Log.warn(`Google Business Messages doesn't provide a device ID`);
        return;
    }
    getRawText() {
        return this.$request.getRawText();
    }
    getAudioData() {
        return undefined;
    }
    getTimestamp() {
        var _a;
        return (_a = this.$request) === null || _a === void 0 ? void 0 : _a.getTimestamp();
    }
    getLocale() {
        var _a, _b;
        return (_b = (_a = this.$config.plugin) === null || _a === void 0 ? void 0 : _a.GoogleBusiness) === null || _b === void 0 ? void 0 : _b.locale;
    }
    getType() {
        return GoogleBusiness_1.GoogleBusiness.appType;
    }
    getPlatformType() {
        return GoogleBusiness_1.GoogleBusiness.type;
    }
    getSelectedElementId() {
        return undefined;
    }
    addSuggestionChips(suggestions) {
        this.$output.GoogleBusiness.Suggestions = suggestions;
        return this;
    }
    setFallback(fallback) {
        this.$output.GoogleBusiness.Fallback = fallback;
        return this;
    }
    async showText(text, options = {}) {
        const data = Object.assign(Object.assign(Object.assign({}, this.makeBaseResponse()), options), { text });
        await GoogleBusinessAPI_1.GoogleBusinessAPI.sendResponse({
            data,
            serviceAccount: this.serviceAccount,
            sessionId: this.$request.getSessionId(),
        });
    }
    makeBaseResponse() {
        const messageId = jovo_core_1.Util.randomStr(12);
        return {
            messageId,
            representative: {
                representativeType: 'BOT',
            },
        };
    }
    get serviceAccount() {
        var _a;
        return (_a = this.$config.plugin) === null || _a === void 0 ? void 0 : _a.GoogleBusiness.serviceAccount;
    }
}
exports.GoogleBusinessBot = GoogleBusinessBot;
//# sourceMappingURL=GoogleBusinessBot.js.map