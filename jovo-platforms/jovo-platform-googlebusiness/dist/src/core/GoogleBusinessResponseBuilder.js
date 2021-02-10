"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleBusinessResponse_1 = require("./GoogleBusinessResponse");
class GoogleBusinessResponseBuilder {
    // tslint:disable-next-line:no-any
    create(json) {
        return GoogleBusinessResponse_1.GoogleBusinessResponse.fromJSON(json);
    }
}
exports.GoogleBusinessResponseBuilder = GoogleBusinessResponseBuilder;
//# sourceMappingURL=GoogleBusinessResponseBuilder.js.map