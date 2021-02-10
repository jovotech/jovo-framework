"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class GoogleBusinessUser extends jovo_core_1.User {
    constructor(googleBusinessBot) {
        super(googleBusinessBot);
        this.googleBusinessBot = googleBusinessBot;
    }
    getId() {
        return this.googleBusinessBot.$request.getSessionId();
    }
}
exports.GoogleBusinessUser = GoogleBusinessUser;
//# sourceMappingURL=GoogleBusinessUser.js.map