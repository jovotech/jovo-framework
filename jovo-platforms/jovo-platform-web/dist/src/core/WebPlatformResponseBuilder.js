"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebAppResponse_1 = require("./WebAppResponse");
class WebPlatformResponseBuilder {
    // tslint:disable-next-line:no-any
    create(json) {
        return WebAppResponse_1.WebAppResponse.fromJSON(json);
    }
}
exports.WebPlatformResponseBuilder = WebPlatformResponseBuilder;
//# sourceMappingURL=WebPlatformResponseBuilder.js.map