/// <reference types="universal-analytics" />
import { GoogleAnalyticsAssistant } from ".";
import { Jovo } from "jovo-core";
export declare class VoiceGiftGAnalyticsAssistant extends GoogleAnalyticsAssistant {
    initVisitor(jovo: Jovo): import("universal-analytics").Visitor;
    getSessionTag(jovo: Jovo): string | undefined;
}
