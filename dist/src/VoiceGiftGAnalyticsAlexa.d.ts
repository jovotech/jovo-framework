import { GoogleAnalyticsAlexa } from "./GoogleAnalyticsAlexa";
import * as ua from 'universal-analytics';
import { Jovo } from "jovo-core";
export declare class VoiceGiftGAnalyticsAlexa extends GoogleAnalyticsAlexa {
    initVisitor(jovo: Jovo): ua.Visitor;
    getSessionTag(jovo: Jovo): string | undefined;
}
