"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LindenbaumResponse_1 = require("./LindenbaumResponse");
class LindenbaumResponseBuilder {
    // tslint:disable-next-line:no-any
    create(json) {
        return LindenbaumResponse_1.LindenbaumResponse.fromJSON(json);
    }
}
exports.LindenbaumResponseBuilder = LindenbaumResponseBuilder;
//# sourceMappingURL=LindenbaumResponseBuilder.js.map