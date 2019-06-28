"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalyticsSender_1 = require("./GoogleAnalyticsSender");
const _get = require("lodash.get");
const util = require("util");
class GoogleAnalyticsAlexa extends GoogleAnalyticsSender_1.GoogleAnalyticsSender {
    //middleware functions:
    //only invoke if platform is matching
    setJovoObjectAccess(handleRequest) {
        if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'AlexaSkill') {
            super.setJovoObjectAccess(handleRequest);
        }
    }
    sendDataToGA(handleRequest) {
        if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'AlexaSkill') {
            super.sendDataToGA(handleRequest);
            console.log("*****+Alexa sent data to GA");
        }
    }
    //Help methods for middleware functions
    //Overwrite base class functions to add platform specific content
    sendFlowErrors(jovo) {
        super.sendFlowErrors(jovo);
        if (jovo.getRoute().type === "END") { //check for sessionEndedRequests with failure reason
            if (jovo.isAlexaSkill()) { //only avaiable momently for Alexa Skills
                const alexaRequest = jovo.$request;
                console.log(`..is session Ended Request.. checking reason..`);
                if (alexaRequest.request.reason === 'EXCEEDED_MAX_REPROMPTS') {
                    this.sendUserEvent(jovo, "FlowError", "exceeded reprompts");
                    console.log("'..send exceeded reprompts event to GA.");
                }
                else {
                    console.log(`session Ended Request with no flow Errors. Route: ${util.inspect(jovo.getRoute())}`);
                }
            }
        }
    }
    initVisitor(jovo) {
        const visitor = super.initVisitor(jovo);
        //set device and screen resolution
        const alexaRequest = jovo.$request;
        const deviceInfo = alexaRequest.getAlexaDevice();
        visitor.set("screenResolution", alexaRequest.getScreenResolution());
        visitor.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`); //fake UserAgent which makes GA mappping device to browser field and platform type to mobile
        //set referrer link for redirected users 
        const launchType = _get(jovo.$request, 'request.launchRequestType');
        if (launchType) {
            //console.log("setting document referrer to " + _get(jovo.$request, 'request.metadata.referrer')); not used in GA momently
            visitor.set('documentReferrer', _get(jovo.$request, 'request.metadata.referrer'));
        }
        return visitor;
    }
    getCurrentPageParameters(jovo) {
        let modPageParams = super.getCurrentPageParameters(jovo);
        //set host to referrer if launch was referred
        const launchType = _get(jovo.$request, 'request.launchRequestType');
        if (launchType) {
            modPageParams.dh = launchType;
        }
        return modPageParams;
    }
}
exports.GoogleAnalyticsAlexa = GoogleAnalyticsAlexa;
//# sourceMappingURL=GoogleAnalyticsAlexa.js.map