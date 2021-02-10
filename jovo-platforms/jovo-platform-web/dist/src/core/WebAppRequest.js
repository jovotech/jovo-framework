"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_platform_core_1 = require("jovo-platform-core");
class WebAppRequest extends jovo_platform_core_1.CorePlatformRequest {
    constructor() {
        super(...arguments);
        this.type = 'jovo-platform-web';
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, WebAppRequest.reviver);
        }
        else {
            const request = Object.create(WebAppRequest.prototype);
            return Object.assign(request, json);
        }
    }
    // tslint:disable-next-line:no-any
    static reviver(key, value) {
        return key === '' ? WebAppRequest.fromJSON(value) : value;
    }
}
exports.WebAppRequest = WebAppRequest;
//# sourceMappingURL=WebAppRequest.js.map