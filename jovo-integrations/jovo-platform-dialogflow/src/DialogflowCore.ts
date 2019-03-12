import {NLUData, Plugin, BaseApp, PluginConfig} from "jovo-core";
import _get = require('lodash.get');
import _set = require('lodash.set');
import {EnumRequestType} from "jovo-core";
import {Dialogflow} from "./Dialogflow";
import {DialogflowAgent} from "./DialogflowAgent";
import {DialogflowRequest} from "./core/DialogflowRequest";
import {DialogflowResponse} from "./core/DialogflowResponse";

export interface Config extends PluginConfig {
    sessionContextId?: string;
}


export class DialogflowCore implements Plugin {

    config: Config = {
        enabled: true,
        sessionContextId: 'session',

    };

    constructor(config?: Config) {
    }

    install(dialogFlow: Dialogflow) {
        dialogFlow.middleware('$request')!.use(this.request.bind(this));
        dialogFlow.middleware('$type')!.use(this.type.bind(this));
        dialogFlow.middleware('$session')!.use(this.session.bind(this));

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

        if (_get(dialogflowRequest, 'queryResult.intent')) {

            if (_get(dialogflowRequest, 'queryResult.intent.displayName') === 'Default Welcome Intent') {
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
            _set(nluData, 'intent.name', _get(dialogflowRequest, 'queryResult.intent.displayName'));
        }
        dialogflowAgent.$nlu = nluData;
    }

    inputs(dialogflowAgent: DialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
        dialogflowAgent.$inputs = dialogflowRequest.getInputs();
    }

    session(dialogflowAgent: DialogflowAgent)  {
        const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
        const sessionId = _get(dialogflowRequest, 'session');

        if (_get(dialogflowRequest, 'queryResult.outputContexts')) {
            const sessionContext =_get(dialogflowRequest, 'queryResult.outputContexts').find((context: any) => { // tslint:disable-line
                return context.name === `${sessionId}/contexts/${this.config.sessionContextId}`;
            });

            if (sessionContext) {
                dialogflowAgent.$session.$data = sessionContext.parameters;

                for (const parameter of Object.keys(_get(dialogflowRequest, 'queryResult.parameters'))) {
                    delete dialogflowAgent.$session.$data[parameter];
                    delete dialogflowAgent.$session.$data[parameter + '.original'];
                }
            }
            dialogflowAgent.$requestSessionAttributes = JSON.parse(JSON.stringify(dialogflowAgent.$session.$data));
        }
    }

    output(dialogflowAgent: DialogflowAgent) {
        const output = dialogflowAgent.$output;

        if (!dialogflowAgent.$response) {
            dialogflowAgent.$response = new DialogflowResponse();
        }


        if (output.tell) {
            _set(dialogflowAgent.$response, 'fulfillmentText', `${output.tell.speech}`);
        }

        if (output.ask) {
            _set(dialogflowAgent.$response, 'fulfillmentText', `${output.ask.speech}`);
        }
        const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;

        const sessionId = _get(dialogflowRequest, 'session');

        const outputContexts = _get(dialogflowRequest, 'queryResult.outputContexts', []);
        const contextName = `${sessionId}/contexts/${this.config.sessionContextId}`;

        if (Object.keys(dialogflowAgent.$session.$data).length > 0) {
            const sessionContext = outputContexts.find((context: any) => { // tslint:disable-line
                return context.name === contextName;
            });

            if (sessionContext) {
                outputContexts.forEach((context: any) => { // tslint:disable-line
                    if (context.name === contextName) {
                        context.parameters = dialogflowAgent.$session.$data;
                    }
                });
            } else {
                outputContexts.push({
                    name: contextName,
                    lifespanCount: 1000,
                    parameters: dialogflowAgent.$session.$data
                });
            }
        }
        _set(dialogflowAgent.$response, 'outputContexts', outputContexts);


        if (_get(output, 'Dialogflow.Payload')) {
            _set(dialogflowAgent.$response, 'payload', _get(output, 'Dialogflow.Payload'));
        }
    }

}
