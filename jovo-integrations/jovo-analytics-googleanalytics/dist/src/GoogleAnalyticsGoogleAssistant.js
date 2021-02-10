"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalytics_1 = require("./GoogleAnalytics");
const jovo_core_1 = require("jovo-core");
const lodash_1 = require("lodash");
class GoogleAnalyticsGoogleAssistant extends GoogleAnalytics_1.GoogleAnalytics {
    track(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
        if (jovo.constructor.name !== 'GoogleAction') {
            return;
        }
        const dialogFlowRequest = jovo.$request;
        const userName = lodash_1.get(dialogFlowRequest.originalDetectIntentRequest.payload, 'user.profile.familyName');
        const isCrawler = userName && userName === 'Crawler';
        if (isCrawler) {
            return;
        }
        if (!this.config.skipUnverifiedUser) {
            const userVerificationStatus = lodash_1.get(dialogFlowRequest.originalDetectIntentRequest.payload, 'user.userVerificationStatus'); //  inputs[0].rawInputs[0].inputType');
            const isVoiceMatchUser = userVerificationStatus && userVerificationStatus === 'VERIFIED';
            if (!isVoiceMatchUser) {
                return;
            }
        }
        super.track(handleRequest);
    }
    initVisitor(jovo) {
        super.initVisitor(jovo);
        const request = jovo.$request;
        const deviceInfo = `Google Assistant Device - ${request.hasScreenInterface() ? 'Display Support' : 'Voice Only'}`;
        // fake UserAgent which makes GA mappping device to browser field and platform type to mobile
        this.visitor.set('userAgentOverride', `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`);
    }
    setGoogleAnalyticsObject(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
        super.setGoogleAnalyticsObject(handleRequest);
    }
}
exports.GoogleAnalyticsGoogleAssistant = GoogleAnalyticsGoogleAssistant;
//# sourceMappingURL=GoogleAnalyticsGoogleAssistant.js.map