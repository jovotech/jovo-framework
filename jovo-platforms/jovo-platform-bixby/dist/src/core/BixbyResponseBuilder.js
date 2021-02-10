"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BixbyResponse_1 = require("./BixbyResponse");
class BixbyResponseBuilder {
    // tslint:disable:no-any
    create(json) {
        return BixbyResponse_1.BixbyResponse.fromJSON(json);
    }
}
exports.BixbyResponseBuilder = BixbyResponseBuilder;
//# sourceMappingURL=BixbyResponseBuilder.js.map