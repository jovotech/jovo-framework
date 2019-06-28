"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class VoiceGiftGAnalyticsAssistant extends _1.GoogleAnalyticsAssistant {
    initVisitor(jovo) {
        let visitor = super.initVisitor(jovo);
        visitor.set("campaignMedium", "referral");
        visitor.set("campaignSource", "googleAction");
        return visitor;
    }
    getSessionTag(jovo) {
        const tag = super.getSessionTag(jovo);
        if (tag !== 'end') {
            return tag;
        }
        else {
            return undefined;
        }
    }
}
exports.VoiceGiftGAnalyticsAssistant = VoiceGiftGAnalyticsAssistant;
//# sourceMappingURL=VoiceGiftGAnalyticsAssistant.js.map