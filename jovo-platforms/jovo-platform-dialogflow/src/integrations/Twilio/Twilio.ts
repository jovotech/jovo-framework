import {Plugin, BaseApp} from "jovo-core";
import _get = require('lodash.get');
import {Config} from "../../DialogflowCore";
import {Dialogflow} from "../../Dialogflow";
import {DialogflowAgent} from "../../DialogflowAgent";
import {TwilioUser} from "./TwilioUser";

export class Twilio implements Plugin {
    config: Config = {
        enabled: true,
    };

    constructor(config?: Config) {}

    install(dialogFlow: Dialogflow) {
        dialogFlow.middleware('$type')!.use(this.type.bind(this));

        DialogflowAgent.prototype.isTwilioBot = function() {
            return _get(this.$request, 'originalDetectIntentRequest.source') === 'twilio';
        };
    }

    uninstall(app: BaseApp) {}

    type(dialogflowAgent: DialogflowAgent) {
        if (dialogflowAgent.isTwilioBot()) {
            dialogflowAgent.$user = new TwilioUser(dialogflowAgent);
        }
    }
}
