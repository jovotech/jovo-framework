"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CorePlatformResponse_1 = require("./CorePlatformResponse");
class CorePlatformResponseBuilder {
    // tslint:disable-next-line:no-any
    create(json) {
        return CorePlatformResponse_1.CorePlatformResponse.fromJSON(json);
    }
}
exports.CorePlatformResponseBuilder = CorePlatformResponseBuilder;
//# sourceMappingURL=CorePlatformResponseBuilder.js.map