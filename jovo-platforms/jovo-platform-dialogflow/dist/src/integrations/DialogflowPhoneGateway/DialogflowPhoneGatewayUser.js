"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const DialogflowUser_1 = require("../../DialogflowUser");
class DialogflowPhoneGatewayUser extends DialogflowUser_1.DialogflowUser {
    constructor(jovo) {
        super(jovo);
    }
    getAccessToken() {
        return undefined;
    }
    getId() {
        // Use the incoming phone number as the User ID.  For Dialogflow Phone Gateway free tier, this will always be "REDACTED_IN_STANDARD_TIER_AGENT"
        return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.telephony.caller_id');
    }
}
exports.DialogflowPhoneGatewayUser = DialogflowPhoneGatewayUser;
//# sourceMappingURL=DialogflowPhoneGatewayUser.js.map