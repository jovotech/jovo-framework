"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const DialogflowAgent_1 = require("../../DialogflowAgent");
const FacebookMessengerUser_1 = require("./FacebookMessengerUser");
const __1 = require("../..");
class FacebookMessenger {
    constructor(config) {
        this.config = {
            enabled: true,
        };
    }
    install(dialogFlow) {
        dialogFlow.middleware('$output').use(this.output.bind(this));
        dialogFlow.middleware('$type').use(this.type.bind(this));
        DialogflowAgent_1.DialogflowAgent.prototype.isFacebookMessengerBot = function () {
            return _get(this.$request, 'originalDetectIntentRequest.source') === 'facebook';
        };
    }
    uninstall(app) { }
    type(dialogflowAgent) {
        if (dialogflowAgent.isFacebookMessengerBot()) {
            dialogflowAgent.$user = new FacebookMessengerUser_1.FacebookMessengerUser(dialogflowAgent);
        }
    }
    output(dialogflowAgent) {
        if (dialogflowAgent.isFacebookMessengerBot()) {
            const output = dialogflowAgent.$output;
            const isFacebookMessengerRequest = _get(dialogflowAgent.$request, 'originalDetectIntentRequest.source') === 'facebook';
            if (!isFacebookMessengerRequest) {
                return;
            }
            if (!dialogflowAgent.$response) {
                dialogflowAgent.$response = new __1.DialogflowResponse();
            }
            if (_get(output, 'Dialogflow.Payload.facebook')) {
                _set(dialogflowAgent.$response, 'payload.facebook', _get(output, 'Dialogflow.Payload.facebook'));
            }
            if (output.tell) {
                _set(dialogflowAgent.$response, 'payload.facebook.text', `${output.tell.speech}`);
            }
            if (output.ask) {
                _set(dialogflowAgent.$response, 'payload.facebook.text', `${output.ask.speech}`);
            }
        }
    }
}
exports.FacebookMessenger = FacebookMessenger;
//# sourceMappingURL=FacebookMessenger.js.map