"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConversationalActionResponse_1 = require("./ConversationalActionResponse");
class GoogleAssistantResponseBuilder {
    create(json) {
        return ConversationalActionResponse_1.ConversationalActionResponse.fromJSON(json);
    }
}
exports.GoogleAssistantResponseBuilder = GoogleAssistantResponseBuilder;
//# sourceMappingURL=GoogleAssistantResponseBuilder.js.map