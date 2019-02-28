import {Plugin, BaseApp, Jovo, EnumRequestType} from "jovo-core";
import {Config} from "../../DialogflowCore";
import {Dialogflow} from "../../Dialogflow";
import {DialogflowResponse} from "../../core/DialogflowResponse";
import {DialogflowAgent} from "../../DialogflowAgent";
import _set = require('lodash.set');
import _get = require('lodash.get');

export class FacebookMessenger implements Plugin {
    config: Config = {
        enabled: true,
    };

    constructor(config?: Config) {
    }


    install(dialogFlow: Dialogflow) {

        dialogFlow.middleware('$output')!.use(this.output.bind(this));


    }
    uninstall(app: BaseApp) {

    }

    output(dialogflowAgent: DialogflowAgent) {
        const output = dialogflowAgent.$output;

        const isFacebookMessengerRequest = _get(dialogflowAgent.$request, 'originalDetectIntentRequest.source') === 'facebook';

        if (!isFacebookMessengerRequest) {
            return;
        }

        if (!dialogflowAgent.$response) {
            dialogflowAgent.$response = new DialogflowResponse();
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
