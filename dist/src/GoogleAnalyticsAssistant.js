"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalyticsSender_1 = require("./GoogleAnalyticsSender");
const _get = require("lodash.get");
class GoogleAnalyticsAssistant extends GoogleAnalyticsSender_1.GoogleAnalyticsSender {
    //middleware functions:
    //only invoke if platform is matching
    setJovoObjectAccess(handleRequest) {
        if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'GoogleAction') {
            super.setJovoObjectAccess(handleRequest);
        }
    }
    sendDataToGA(handleRequest) {
        if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'GoogleAction') {
            const uuid = this.getUserId(handleRequest.jovo);
            const isHealtCheck = (_get(handleRequest.jovo.$request, 'originalDetectIntentRequest.payload.inputs[0].arguments[0].name') === 'is_health_check') || uuid === '464556658';
            if (!isHealtCheck) {
                super.sendDataToGA(handleRequest);
                console.log("*****Google Assistant sent data to GA");
            }
            else {
                console.log("is healthcheck -> skip");
            }
        }
    }
    //Help methods for middleware functions
    //Overwrite base class functions to add platform specific content
    initVisitor(jovo) {
        const visitor = super.initVisitor(jovo);
        //let  gAssistantRequest = jovo.$googleAction!.$request as GoogleActionRequest;
        let deviceInfo = "notSet";
        if (jovo.$request.hasScreenInterface()) {
            deviceInfo = "Assistant device - with Screen";
        }
        else {
            deviceInfo = "Assistant device - voice Only";
        }
        visitor.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`); //fake UserAgent which makes GA mappping device to browser field and platform type to mobile
        return visitor;
    }
}
exports.GoogleAnalyticsAssistant = GoogleAnalyticsAssistant;
//# sourceMappingURL=GoogleAnalyticsAssistant.js.map