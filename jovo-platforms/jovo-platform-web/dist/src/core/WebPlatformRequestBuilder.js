"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_platform_core_1 = require("jovo-platform-core");
const WebAppRequest_1 = require("./WebAppRequest");
class WebPlatformRequestBuilder extends jovo_platform_core_1.CorePlatformRequestBuilder {
    constructor() {
        super(...arguments);
        this.type = 'WebApp';
        this.requestClass = WebAppRequest_1.WebAppRequest;
    }
}
exports.WebPlatformRequestBuilder = WebPlatformRequestBuilder;
//# sourceMappingURL=WebPlatformRequestBuilder.js.map