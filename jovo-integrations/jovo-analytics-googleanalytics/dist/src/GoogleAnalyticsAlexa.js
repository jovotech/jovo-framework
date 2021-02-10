"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const jovo_core_1 = require("jovo-core");
const GoogleAnalytics_1 = require("./GoogleAnalytics");
class GoogleAnalyticsAlexa extends GoogleAnalytics_1.GoogleAnalytics {
    install(app) {
        var _a;
        (_a = app.middleware('after.handler')) === null || _a === void 0 ? void 0 : _a.use(this.setErrorEndReason.bind(this));
        super.install(app);
    }
    track(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
        if (jovo.constructor.name !== 'AlexaSkill') {
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
        this.visitor.set('userAgentOverride', `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`);
        const referrer = _get(request, 'request.metadata.referrer');
        if (referrer) {
            this.visitor.set('campaignMedium', 'referral');
            this.visitor.set('campaignSource', referrer);
            this.visitor.set('documentReferrer', referrer);
        }
    }
    setGoogleAnalyticsObject(handleRequest) {
        const jovo = handleRequest.jovo;
        if (!jovo) {
            throw new jovo_core_1.JovoError('Jovo object is not set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
        }
        if (jovo.constructor.name !== 'AlexaSkill') {
            return;
        }
        super.setGoogleAnalyticsObject(handleRequest);
    }
    setErrorEndReason(handleRequest) {
        var _a;
        const { jovo } = handleRequest;
        if (!jovo) {
            return;
        }
        const endReason = (_a = jovo.$alexaSkill) === null || _a === void 0 ? void 0 : _a.getEndReason();
        const responseWillEndSessionWithTell = _get(jovo.$output, 'Alexa.tell') || _get(jovo.$output, 'tell'); // aus AlexaCore.ts Zeile 95
        if (this.config.trackEndReasons && endReason) {
            // set End Reason (eg. ERROR, EXCEEDED_MAX_REPROMPTS, PLAYTIME_LIMIT_REACHED, USER_INITIATED, ...)
            this.setEndReason(jovo, endReason);
        }
        else if (responseWillEndSessionWithTell) {
            this.setEndReason(jovo, 'Stop');
        }
    }
    sendUnhandledEvents(jovo) {
        super.sendUnhandledEvents(jovo);
        if (jovo.$alexaSkill.getEndReason() === 'EXCEEDED_MAX_REPROMPTS') {
            this.sendUserEvent(jovo, 'FlowError', 'Exceeded_Max_Reprompts');
        }
    }
}
exports.GoogleAnalyticsAlexa = GoogleAnalyticsAlexa;
//# sourceMappingURL=GoogleAnalyticsAlexa.js.map