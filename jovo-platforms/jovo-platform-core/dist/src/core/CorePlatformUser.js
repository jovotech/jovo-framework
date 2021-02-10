"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class CorePlatformUser extends jovo_core_1.User {
    constructor(jovo) {
        super(jovo);
    }
    getAccessToken() {
        return this.jovo.$request.getAccessToken();
    }
    getId() {
        return this.jovo.$request.getUserId();
    }
}
exports.CorePlatformUser = CorePlatformUser;
//# sourceMappingURL=CorePlatformUser.js.map