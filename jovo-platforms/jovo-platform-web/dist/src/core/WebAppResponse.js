"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_platform_core_1 = require("jovo-platform-core");
class WebAppResponse extends jovo_platform_core_1.CorePlatformResponse {
    // tslint:disable-next-line:no-any
    static reviver(key, value) {
        return key === '' ? WebAppResponse.fromJSON(value) : value;
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json, WebAppResponse.reviver);
        }
        else {
            const response = Object.create(WebAppResponse.prototype);
            return Object.assign(response, json);
        }
    }
    constructor() {
        super();
    }
}
exports.WebAppResponse = WebAppResponse;
//# sourceMappingURL=WebAppResponse.js.map