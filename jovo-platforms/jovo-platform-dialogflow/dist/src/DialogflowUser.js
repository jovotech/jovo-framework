"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class DialogflowUser extends jovo_core_1.User {
    constructor(jovo) {
        super(jovo);
    }
    getAccessToken() {
        return undefined;
    }
    getId() {
        return 'TemporaryDialogflowUserId';
    }
}
exports.DialogflowUser = DialogflowUser;
//# sourceMappingURL=DialogflowUser.js.map