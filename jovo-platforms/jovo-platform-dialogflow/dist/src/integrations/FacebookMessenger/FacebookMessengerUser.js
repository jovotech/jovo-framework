"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const DialogflowUser_1 = require("../../DialogflowUser");
class FacebookMessengerUser extends DialogflowUser_1.DialogflowUser {
    constructor(jovo) {
        super(jovo);
    }
    getAccessToken() {
        return undefined;
    }
    getId() {
        return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.data.sender.id');
    }
}
exports.FacebookMessengerUser = FacebookMessengerUser;
//# sourceMappingURL=FacebookMessengerUser.js.map