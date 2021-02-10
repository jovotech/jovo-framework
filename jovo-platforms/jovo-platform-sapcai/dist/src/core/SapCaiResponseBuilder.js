"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SapCaiResponse_1 = require("./SapCaiResponse");
class SapCaiResponseBuilder {
    // tslint:disable-next-line:no-any
    create(json) {
        return SapCaiResponse_1.SapCaiResponse.fromJSON(json);
    }
}
exports.SapCaiResponseBuilder = SapCaiResponseBuilder;
//# sourceMappingURL=SapCaiResponseBuilder.js.map