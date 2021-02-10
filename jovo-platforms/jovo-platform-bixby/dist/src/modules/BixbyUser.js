"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class BixbyUser extends jovo_core_1.User {
    constructor(bixbyCapsule) {
        super(bixbyCapsule);
        this.bixbyCapsule = bixbyCapsule;
    }
    getId() {
        return this.bixbyCapsule.$request.getUserId();
    }
}
exports.BixbyUser = BixbyUser;
//# sourceMappingURL=BixbyUser.js.map