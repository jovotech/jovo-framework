"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalytics_1 = require("./GoogleAnalytics");
const jovo_core_1 = require("jovo-core");
class GoogleAnalyticsAssistant extends GoogleAnalytics_1.GoogleAnalytics {
    track(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', 'Jovo Instance was not available', 'Contact admin.');
        }
        if (jovo.constructor.name !== 'GoogleAction') {
            return;
        }
        super.track(handleRequest);
    }
    initVisitor(jovo) {
        super.initVisitor(jovo);
        const request = jovo.$request;
        const deviceInfo = `Google Assistant Device - ${request.hasScreenInterface() ? 'Display Support' : 'Voice Only'}`;
        // fake UserAgent which makes GA mappping device to browser field and platform type to mobile
        this.visitor.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`);
    }
    setGoogleAnalyticsObject(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics', 'Jovo Instance was not available', 'Contact admin.');
        }
        if (jovo.constructor.name !== 'GoogleAction') {
            return;
        }
        super.setGoogleAnalyticsObject(handleRequest);
    }
}
exports.GoogleAnalyticsAssistant = GoogleAnalyticsAssistant;
//# sourceMappingURL=GoogleAnalyticsAssistant.js.map