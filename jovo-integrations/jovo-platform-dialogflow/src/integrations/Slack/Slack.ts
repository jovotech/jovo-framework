import {Plugin, BaseApp, Jovo, EnumRequestType} from "jovo-core";
import {Config} from "../../DialogflowCore";
import {Dialogflow} from "../../Dialogflow";
import {DialogflowResponse} from "../../core/DialogflowResponse";
import {DialogflowRequest} from "../../core/DialogflowRequest";
import {DialogflowAgent} from "../../DialogflowAgent";
import _set = require('lodash.set');
import _get = require('lodash.get');


export interface SlackConfig extends Config {
    source: string;
}

export class Slack implements Plugin {
    config: SlackConfig = {
        enabled: true,
        source: 'slack_testbot',
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

        const isSlackRequest = _get(dialogflowAgent.$request, 'originalDetectIntentRequest.source') === this.config.source;

        if (!isSlackRequest) {
            return;
        }

        if (!dialogflowAgent.$response) {
            dialogflowAgent.$response = new DialogflowResponse();
        }

        if (_get(output, 'Dialogflow.Payload.slack')) {
            _set(dialogflowAgent.$response, 'payload.slack', _get(output, 'Dialogflow.Payload.slack'));
        }

        if (output.tell) {
            _set(dialogflowAgent.$response,  'payload.slack.text', `${output.tell.speech}`);
        }
        //
        if (output.ask) {
            _set(dialogflowAgent.$response,  'payload.slack.text', `${output.ask.speech}`);
        }

    }



}
