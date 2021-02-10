"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAction_1 = require("../core/GoogleAction");
const jovo_platform_dialogflow_1 = require("jovo-platform-dialogflow");
const GoogleActionRequest_1 = require("../core/GoogleActionRequest");
const GoogleActionResponse_1 = require("../core/GoogleActionResponse");
class GoogleAssistantDialogflowFactory {
    createPlatformRequest(app, host, handleRequest) {
        return new GoogleAction_1.GoogleAction(app, host, handleRequest);
    }
    createRequest(json) {
        const dialogflowRequest = jovo_platform_dialogflow_1.DialogflowRequest.fromJSON(json);
        dialogflowRequest.originalDetectIntentRequest.payload = GoogleActionRequest_1.GoogleActionRequest.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
        return dialogflowRequest;
    }
    createResponse(json) {
        if (json) {
            const dialogflowResponse = jovo_platform_dialogflow_1.DialogflowResponse.fromJSON(json);
            dialogflowResponse.payload[this.type()] = GoogleActionResponse_1.GoogleActionResponse.fromJSON(dialogflowResponse.payload[this.type()]);
            return dialogflowResponse;
        }
        else {
            return new jovo_platform_dialogflow_1.DialogflowResponse();
        }
    }
    type() {
        return 'google';
    }
}
exports.GoogleAssistantDialogflowFactory = GoogleAssistantDialogflowFactory;
//# sourceMappingURL=GoogleAssistantDialogflowFactory.js.map