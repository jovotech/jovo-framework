"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutopilotResponse_1 = require("./AutopilotResponse");
class AutopilotResponseBuilder {
    // tslint:disable-next-line:no-any
    create(json) {
        return AutopilotResponse_1.AutopilotResponse.fromJSON(json);
    }
}
exports.AutopilotResponseBuilder = AutopilotResponseBuilder;
//# sourceMappingURL=AutopilotResponseBuilder.js.map