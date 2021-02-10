"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleActionResponse_1 = require("./GoogleActionResponse");
class GoogleAssistantResponseBuilder {
    create(json) {
        return GoogleActionResponse_1.GoogleActionResponse.fromJSON(json);
    }
}
exports.GoogleAssistantResponseBuilder = GoogleAssistantResponseBuilder;
//# sourceMappingURL=GoogleAssistantResponseBuilder.js.map