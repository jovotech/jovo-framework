"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class AutopilotUser extends jovo_core_1.User {
    constructor(autopilotBot) {
        super(autopilotBot);
        this.autopilotBot = autopilotBot;
    }
    getId() {
        return this.autopilotBot.$request.getUserId();
    }
}
exports.AutopilotUser = AutopilotUser;
//# sourceMappingURL=AutopilotUser.js.map