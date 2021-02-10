"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaResponse_1 = require("./AlexaResponse");
class AlexaResponseBuilder {
    // tslint:disable-next-line
    create(json) {
        return AlexaResponse_1.AlexaResponse.fromJSON(json);
    }
}
exports.AlexaResponseBuilder = AlexaResponseBuilder;
//# sourceMappingURL=AlexaResponseBuilder.js.map