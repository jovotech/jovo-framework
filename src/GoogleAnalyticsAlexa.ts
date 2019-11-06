// import { GoogleAnalytics } from "./GoogleAnalytics";
// import * as ua from 'universal-analytics';
// import _get = require('lodash.get');
// import * as util from 'util';

// import { HandleRequest, Jovo } from "jovo-core";
// import { AlexaRequest } from "jovo-platform-alexa";

// export class GoogleAnalyticsAlexa extends GoogleAnalytics {

//     //middleware functions:
//     //only invoke if platform is matching
//     setJovoObjectAccess(handleRequest: HandleRequest) {
//         if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'AlexaSkill') {
//             super.setJovoObjectAccess(handleRequest);
//         }
//     }

//     sendDataToGA(handleRequest: HandleRequest) {
//         if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'AlexaSkill') {
//             super.sendDataToGA(handleRequest);
//         }
//     }



//     //Help methods for middleware functions
//     //Overwrite base class functions to add platform specific content
//     sendFlowErrors(jovo: Jovo) {
//         super.sendFlowErrors(jovo);
//         if (jovo.getRoute().type === "END") {  //check for sessionEndedRequests with failure reason
//             if (jovo.isAlexaSkill()) { //only avaiable momently for Alexa Skills
//                 const alexaRequest = jovo.$request as AlexaRequest;
//                 console.log(`..is session Ended Request.. checking reason..`);
//                 if (alexaRequest.request!.reason === 'EXCEEDED_MAX_REPROMPTS') {
//                     this.sendUserEvent(jovo, "FlowError", "exceeded reprompts");
//                     console.log("'..sent exceeded reprompts event to GA.");
//                 }
//                 else {
//                     console.log(`session Ended Request with no flow Errors. Route: ${util.inspect(jovo.getRoute())}`);
//                 }
//             }
//         }
//     }


//     initVisitor(jovo: Jovo): ua.Visitor {
//         const visitor = super.initVisitor(jovo);

//         //set device and screen resolution
//         const alexaRequest = jovo.$request as AlexaRequest;
//         const deviceInfo = alexaRequest.getAlexaDevice();
//         visitor.set("screenResolution", alexaRequest.getScreenResolution());
//         visitor.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`); //fake UserAgent which makes GA mappping device to browser field and platform type to mobile

//         //set referrer link for redirected users 
//         const launchType: string | undefined = _get(jovo.$request, 'request.launchRequestType');
//         if (launchType) {
//             visitor.set('documentReferrer', _get(jovo.$request, 'request.metadata.referrer'));
//         }
//         return visitor;
//     }

//     getCurrentPageParameters(jovo: Jovo): ua.PageviewParams {
//         let modPageParams = super.getCurrentPageParameters(jovo);

//         //set host to referrer if launch was referred
//         const launchType: string | undefined = _get(jovo.$request, 'request.launchRequestType');
//         if (launchType) {
//             modPageParams.dh = launchType;
//         }
//         return modPageParams;
//     }
// }