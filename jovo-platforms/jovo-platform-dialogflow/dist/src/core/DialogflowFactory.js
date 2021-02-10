"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DialogflowResponse_1 = require("./DialogflowResponse");
const DialogflowRequest_1 = require("./DialogflowRequest");
const DialogflowAgent_1 = require("../DialogflowAgent");
class DialogflowFactory {
    createPlatformRequest(app, host, handleRequest) {
        return new DialogflowAgent_1.DialogflowAgent(app, host, handleRequest);
    }
    createRequest(json) {
        return DialogflowRequest_1.DialogflowRequest.fromJSON(json);
    }
    createResponse(json) {
        if (json) {
            return DialogflowResponse_1.DialogflowResponse.fromJSON(json);
        }
        else {
            return new DialogflowResponse_1.DialogflowResponse();
        }
    }
    type() {
        return 'dialogflow';
    }
}
exports.DialogflowFactory = DialogflowFactory;
//# sourceMappingURL=DialogflowFactory.js.map