"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const DialogflowUser_1 = require("../../DialogflowUser");
class TwilioUser extends DialogflowUser_1.DialogflowUser {
    constructor(jovo) {
        super(jovo);
        this.twilioPayload = _get(jovo.$request, 'originalDetectIntentRequest.payload.data');
    }
    getAccessToken() {
        return undefined;
    }
    getPhoneNumber() {
        return this.twilioPayload.From;
    }
    getCarrierLocation() {
        return {
            city: this.twilioPayload.FromCity,
            zip: this.twilioPayload.FromZip,
            state: this.twilioPayload.FromState,
        };
    }
    getTwilioPayload() {
        return this.twilioPayload;
    }
}
exports.TwilioUser = TwilioUser;
//# sourceMappingURL=TwilioUser.js.map