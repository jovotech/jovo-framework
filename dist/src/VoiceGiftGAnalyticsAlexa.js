"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalyticsAlexa_1 = require("./GoogleAnalyticsAlexa");
class VoiceGiftGAnalyticsAlexa extends GoogleAnalyticsAlexa_1.GoogleAnalyticsAlexa {
    initVisitor(jovo) {
        let visitor = super.initVisitor(jovo);
        visitor.set("campaignMedium", "referral");
        visitor.set("campaignSource", "alexaSkill");
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
exports.VoiceGiftGAnalyticsAlexa = VoiceGiftGAnalyticsAlexa;
//# sourceMappingURL=VoiceGiftGAnalyticsAlexa.js.map