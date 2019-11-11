"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const GoogleAnalytics_1 = require("./GoogleAnalytics");
class GoogleAnalyticsAlexa extends GoogleAnalytics_1.GoogleAnalytics {
    track(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', 'Jovo Instance was not available', 'Contact admin.');
        }
        if (!jovo.isAlexaSkill()) {
            return;
        }
        super.track(handleRequest);
    }
    initVisitor(jovo) {
        super.initVisitor(jovo);
        const request = jovo.$request;
        const deviceInfo = request.getDeviceName();
        this.visitor.set('screenResolution', request.getScreenResolution());
        // fake UserAgent which makes GA mappping device to browser field and platform type to mobile
        this.visitor.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`);
        const referrer = _get(request, 'request.metadata.referrer');
        if (referrer) {
            this.visitor.set("campaignMedium", "referral");
            this.visitor.set("campaignSource", referrer);
            this.visitor.set('documentReferrer', referrer);
        }
    }
    setGoogleAnalyticsObject(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', 'Jovo Instance was not available', 'Contact admin.');
        }
        if (!jovo.isAlexaSkill()) {
            return;
        }
        super.setGoogleAnalyticsObject(handleRequest);
    }
    sendUnhandledEvents(jovo) {
        super.sendUnhandledEvents(jovo);
        if (!jovo.isAlexaSkill()) {
            return;
        }
        if (jovo.$alexaSkill.getEndReason() === 'EXCEEDED_MAX_REPROMPTS') {
            this.sendUserEvent(jovo, "FlowError", "exceeded reprompts");
        }
    }
}
exports.GoogleAnalyticsAlexa = GoogleAnalyticsAlexa;
//# sourceMappingURL=GoogleAnalyticsAlexa.js.map