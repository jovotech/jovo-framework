"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class LindenbaumUser extends jovo_core_1.User {
    constructor(lindenbaumBot) {
        super(lindenbaumBot);
        this.lindenbaumBot = lindenbaumBot;
    }
    getId() {
        return this.lindenbaumBot.$request.getUserId();
    }
}
exports.LindenbaumUser = LindenbaumUser;
//# sourceMappingURL=LindenbaumUser.js.map