import { GoogleAnalyticsAlexa } from "./GoogleAnalyticsAlexa";
import * as ua from 'universal-analytics';
import { Jovo } from "jovo-core";

export class VoiceGiftGAnalyticsAlexa extends GoogleAnalyticsAlexa  {
    initVisitor(jovo : Jovo) :ua.Visitor {
        let visitor = super.initVisitor(jovo);
        visitor.set("campaignMedium", "referral");
        visitor.set("campaignSource", "alexaSkill");
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