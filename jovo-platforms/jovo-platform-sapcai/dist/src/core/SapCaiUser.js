"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class SapCaiUser extends jovo_core_1.User {
    constructor(caiSkill) {
        super(caiSkill);
        this.caiSkill = caiSkill;
    }
    getAccessToken() {
        return this.caiSkill.$request.getAccessToken();
    }
    getId() {
        return this.caiSkill.$request.getUserId();
    }
}
exports.SapCaiUser = SapCaiUser;
//# sourceMappingURL=SapCaiUser.js.map