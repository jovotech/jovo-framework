import { GoogleAnalyticsAssistant } from ".";
import { Jovo } from "jovo-core";

export class VoiceGiftGAnalyticsAssistant extends GoogleAnalyticsAssistant {
    initVisitor(jovo : Jovo) {
        let visitor = super.initVisitor(jovo);
        visitor.set("campaignMedium", "referral");
        visitor.set("campaignSource", "googleAction");
        return visitor;
    }

    getSessionTag(jovo : Jovo) : string | undefined {
        const tag = super.getSessionTag(jovo);
        if(tag !== 'end')    {
            return tag;
        }
        else {
            return undefined;
        }
    }
}
