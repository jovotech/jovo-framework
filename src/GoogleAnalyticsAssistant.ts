// import { GoogleAnalyticsSender } from "./GoogleAnalytics";
// import * as ua from 'universal-analytics';
// import _get = require('lodash.get');



// import { HandleRequest, Jovo } from "jovo-core";

// export class GoogleAnalyticsAssistant extends GoogleAnalyticsSender {

//     //middleware functions:
//     //only invoke if platform is matching
//     setJovoObjectAccess(handleRequest: HandleRequest) {
//         if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'GoogleAction') {
//             super.setJovoObjectAccess(handleRequest);
//         }
//     }

//     sendDataToGA(handleRequest: HandleRequest) {
//         if (handleRequest.jovo && handleRequest.jovo.constructor.name === 'GoogleAction') {
//             const uuid = this.getUserId(handleRequest.jovo);
//             const isHealtCheck = (_get(handleRequest.jovo.$request!, 'originalDetectIntentRequest.payload.inputs[0].arguments[0].name') === 'is_health_check') || uuid === '464556658';
//             if (!isHealtCheck) {
//                 super.sendDataToGA(handleRequest);
//             }
//             else {
//                 console.log("is healthcheck -> skip");
//             }
//         }
        

//     }


//     //Help methods for middleware functions
//     //Overwrite base class functions to add platform specific content
//     initVisitor(jovo: Jovo): ua.Visitor {
//         const visitor = super.initVisitor(jovo);
//         let deviceInfo = "notSet";
//         if (jovo.$request!.hasScreenInterface()) {
//             deviceInfo = "Assistant device - with screen";
//         }
//         else {
//             deviceInfo = "Assistant device - voice only";
//         }


//         visitor.set("userAgentOverride", `${deviceInfo} (Linux;Android 5.1.1) ExoPlayerLib/1.5.9`); //fake UserAgent which makes GA mappping device to browser field and platform type to mobile
//         return visitor;

//     }



// }