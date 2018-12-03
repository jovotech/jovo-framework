import {NLUData, Plugin, BaseApp, PluginConfig} from "jovo-core";
import * as _ from "lodash";
import {EnumRequestType} from "jovo-core";
import {Dialogflow} from "./Dialogflow";
import {DialogflowAgent} from "./DialogflowAgent";
import {DialogflowRequest} from "./core/DialogflowRequest";
import {DialogflowResponse} from "./core/DialogflowResponse";
import {Jovo} from "../../../jovo-core/dist/src";

export interface Config extends PluginConfig {

}


export class DialogflowCore implements Plugin {

    config: Config = {
        enabled: true,
    };

    constructor(config?: Config) {
    }

    install(dialogFlow: Dialogflow) {
        dialogFlow.middleware('$request')!.use(this.request.bind(this));
        dialogFlow.middleware('$type')!.use(this.type.bind(this));

        dialogFlow.middleware('$nlu')!.use(this.nlu.bind(this));
        dialogFlow.middleware('$inputs')!.use(this.inputs.bind(this));
        dialogFlow.middleware('$output')!.use(this.output.bind(this));

    }
    uninstall(app: BaseApp) {

    }


    request(dialogflowAgent: DialogflowAgent) {
        dialogflowAgent.$request = DialogflowRequest.fromJSON(dialogflowAgent.$host.$request) as DialogflowRequest;
    }

    type(dialogflowAgent: DialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;

        if (_.get(dialogflowRequest, 'queryResult.intent')) {

            if (_.get(dialogflowRequest, 'queryResult.intent.displayName') === 'Default Welcome Intent') {
                dialogflowAgent.$type = {
                    type: EnumRequestType.LAUNCH
                };

            } else {
                dialogflowAgent.$type = {
                    type: EnumRequestType.INTENT
                };
            }
        }
    }

    nlu(dialogflowAgent: DialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
        const nluData: NLUData = {

        };
        if (dialogflowAgent.$type.type === EnumRequestType.INTENT) {
            _.set(nluData, 'intent.name', _.get(dialogflowRequest, 'queryResult.intent.displayName'));
        }
        dialogflowAgent.$nlu = nluData;
    }

    inputs(dialogflowAgent: DialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
        dialogflowAgent.$inputs = dialogflowRequest.getInputs();
    }

    output(dialogflowAgent: DialogflowAgent) {
        const output = dialogflowAgent.$output;

        if (!dialogflowAgent.$response) {
            dialogflowAgent.$response = new DialogflowResponse();
        }

        if (output.tell) {
            _.set(dialogflowAgent.$response, 'fulfillmentText', `<speak>${output.tell.speech}</speak>`);
        }

        if (output.ask) {
            _.set(dialogflowAgent.$response, 'fulfillmentText', `<speak>${output.ask.speech}</speak>`);
        }
        console.log(dialogflowAgent.$response);
    }

}
