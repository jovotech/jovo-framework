"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const DialogflowAgent_1 = require("../../DialogflowAgent");
const TwilioUser_1 = require("./TwilioUser");
class Twilio {
    constructor(config) {
        this.config = {
            enabled: true,
        };
    }
    install(dialogFlow) {
        dialogFlow.middleware('$type').use(this.type.bind(this));
        DialogflowAgent_1.DialogflowAgent.prototype.isTwilioBot = function () {
            return _get(this.$request, 'originalDetectIntentRequest.source') === 'twilio';
        };
    }
    uninstall(app) { }
    type(dialogflowAgent) {
        if (dialogflowAgent.isTwilioBot()) {
            dialogflowAgent.$user = new TwilioUser_1.TwilioUser(dialogflowAgent);
        }
    }
}
exports.Twilio = Twilio;
//# sourceMappingURL=Twilio.js.map