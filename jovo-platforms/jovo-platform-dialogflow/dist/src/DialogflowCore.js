"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const DialogflowRequest_1 = require("./core/DialogflowRequest");
const DialogflowResponse_1 = require("./core/DialogflowResponse");
const _get = require("lodash.get");
const _set = require("lodash.set");
class DialogflowCore {
    constructor(config) {
        this.config = {
            enabled: true,
            sessionContextId: '_jovo_session_',
        };
    }
    install(dialogFlow) {
        dialogFlow.middleware('$request').use(this.request.bind(this));
        dialogFlow.middleware('$type').use(this.type.bind(this));
        dialogFlow.middleware('$session').use(this.session.bind(this));
        dialogFlow.middleware('$nlu').use(this.nlu.bind(this));
        dialogFlow.middleware('$inputs').use(this.inputs.bind(this));
        dialogFlow.middleware('$output').use(this.output.bind(this));
    }
    uninstall(app) { }
    request(dialogflowAgent) {
        dialogflowAgent.$request = DialogflowRequest_1.DialogflowRequest.fromJSON(dialogflowAgent.$host.$request);
    }
    type(dialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request;
        if (_get(dialogflowRequest, 'queryResult.intent')) {
            if (_get(dialogflowRequest, 'queryResult.intent.displayName') === 'Default Welcome Intent') {
                dialogflowAgent.$type = {
                    type: jovo_core_1.EnumRequestType.LAUNCH,
                };
            }
            else {
                dialogflowAgent.$type = {
                    type: jovo_core_1.EnumRequestType.INTENT,
                };
            }
        }
    }
    nlu(dialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request;
        const nluData = new jovo_core_1.NluData();
        if (dialogflowAgent.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            _set(nluData, 'intent.name', _get(dialogflowRequest, 'queryResult.intent.displayName'));
        }
        dialogflowAgent.$nlu = nluData;
    }
    inputs(dialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request;
        dialogflowAgent.$inputs = dialogflowRequest.getInputs();
    }
    session(dialogflowAgent) {
        const dialogflowRequest = dialogflowAgent.$request;
        const sessionId = _get(dialogflowRequest, 'session');
        const sessionKey = `${sessionId}/contexts/${this.config.sessionContextId}`;
        if (_get(dialogflowRequest, 'queryResult.outputContexts')) {
            const sessionContext = _get(dialogflowRequest, 'queryResult.outputContexts').find(
            // tslint:disable-next-line
            (context) => {
                return context.name.startsWith(sessionKey);
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
    output(dialogflowAgent) {
        const output = dialogflowAgent.$output;
        const request = dialogflowAgent.$request;
        if (!dialogflowAgent.$response) {
            dialogflowAgent.$response = new DialogflowResponse_1.DialogflowResponse();
        }
        if (output.tell) {
            dialogflowAgent.$response.fulfillmentText = output.tell.speech.toString();
        }
        if (output.ask) {
            dialogflowAgent.$response.fulfillmentText = output.ask.speech.toString();
        }
        const outputContexts = request.queryResult.outputContexts || [];
        const sessionContextPrefix = `${request.session}/contexts/${this.config.sessionContextId}`;
        // remove non-jovo contexts
        const newOutputContexts = outputContexts.filter((context) => {
            return (!context.name.startsWith(sessionContextPrefix) &&
                context.lifespanCount &&
                context.lifespanCount > 0);
        });
        // add ask context
        if (output.ask) {
            newOutputContexts.push({
                name: `${request.session}/contexts/_jovo_ask_${jovo_core_1.Util.randomStr(5)}`,
                lifespanCount: 1,
                parameters: { ask: true },
            });
        }
        // add jovo session context
        if (Object.keys(dialogflowAgent.$session.$data).length > 0) {
            newOutputContexts.push({
                name: `${sessionContextPrefix}${jovo_core_1.Util.randomStr(5)}`,
                lifespanCount: 1,
                parameters: dialogflowAgent.$session.$data,
            });
        }
        if (dialogflowAgent.$output.Dialogflow && dialogflowAgent.$output.Dialogflow.OutputContexts) {
            for (let i = 0; i < dialogflowAgent.$output.Dialogflow.OutputContexts.length; i++) {
                const contextObj = dialogflowAgent.$output.Dialogflow.OutputContexts[i];
                const outputContextName = `${request.session}/contexts/${contextObj.name}`;
                let updateCount = 0;
                for (let j = 0; j < newOutputContexts.length; j++) {
                    if (newOutputContexts[j] &&
                        newOutputContexts[j].name === outputContextName) {
                        newOutputContexts[j].lifespanCount = contextObj.lifespanCount;
                        newOutputContexts[j].parameters = contextObj.parameters;
                        updateCount++;
                    }
                }
                if (updateCount === 0) {
                    newOutputContexts.push({
                        name: outputContextName,
                        lifespanCount: contextObj.lifespanCount,
                        parameters: contextObj.parameters,
                    });
                }
            }
        }
        dialogflowAgent.$response.outputContexts = newOutputContexts;
        if (_get(output, 'Dialogflow.Payload')) {
            _set(dialogflowAgent.$response, 'payload', _get(output, 'Dialogflow.Payload'));
        }
    }
}
exports.DialogflowCore = DialogflowCore;
//# sourceMappingURL=DialogflowCore.js.map