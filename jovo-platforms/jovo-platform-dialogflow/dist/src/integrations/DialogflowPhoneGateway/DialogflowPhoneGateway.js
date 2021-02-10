"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const DialogflowAgent_1 = require("../../DialogflowAgent");
const DialogflowPhoneGatewayUser_1 = require("./DialogflowPhoneGatewayUser");
const __1 = require("../..");
/*
export interface DialogflowPhoneGatewayConfig extends Config {
  source: string;
}
*/
class DialogflowPhoneGateway {
    constructor(config) {
        this.config = {
            enabled: true,
        };
    }
    install(dialogFlow) {
        dialogFlow.middleware('$output').use(this.output.bind(this));
        dialogFlow.middleware('$type').use(this.type.bind(this));
        DialogflowAgent_1.DialogflowAgent.prototype.isDialogflowPhoneGateway = function () {
            return _get(this.$request, 'originalDetectIntentRequest.source') === 'GOOGLE_TELEPHONY';
        };
    }
    uninstall(app) { }
    type(dialogflowAgent) {
        if (dialogflowAgent.isDialogflowPhoneGateway()) {
            dialogflowAgent.$user = new DialogflowPhoneGatewayUser_1.DialogflowPhoneGatewayUser(dialogflowAgent);
        }
    }
    output(dialogflowAgent) {
        if (dialogflowAgent.isDialogflowPhoneGateway()) {
            const output = dialogflowAgent.$output;
            if (!dialogflowAgent.$response) {
                dialogflowAgent.$response = new __1.DialogflowResponse();
            }
            const response = dialogflowAgent.$response;
            if (response.fulfillmentText && jovo_core_1.SpeechBuilder.isSSML(response.fulfillmentText)) {
                const ssml = response.fulfillmentText;
                if (!response.fulfillmentMessages) {
                    response.fulfillmentMessages = [];
                }
                response.fulfillmentMessages.push({
                    platform: 'TELEPHONY',
                    telephonySynthesizeSpeech: {
                        ssml,
                    },
                });
                response.fulfillmentText = jovo_core_1.SpeechBuilder.removeSSML(response.fulfillmentText);
            }
            else {
                jovo_core_1.Log.info('Response does not contain SSML');
            }
        }
    }
}
exports.DialogflowPhoneGateway = DialogflowPhoneGateway;
//# sourceMappingURL=DialogflowPhoneGateway.js.map