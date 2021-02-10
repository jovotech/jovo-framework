"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _get = require("lodash.get");
const _set = require("lodash.set");
const index_1 = require("../index");
const DialogflowResponseBuilder_1 = require("../core/DialogflowResponseBuilder");
class DialogflowPlugin extends jovo_core_1.Extensible {
    constructor(config, factory) {
        super(config);
        this.factory = factory;
        this.config = {
            enabled: true,
        };
        this.init = async (handleRequest) => {
            const requestObject = handleRequest.host.getRequestObject();
            const isDialogflowOnlyRequest = requestObject.queryResult &&
                requestObject.originalDetectIntentRequest &&
                requestObject.session &&
                Object.keys(requestObject.originalDetectIntentRequest).length === 1;
            const notStandaloneDialogflow = !handleRequest.app.getPlatformByName('Dialogflow') && isDialogflowOnlyRequest;
            if (notStandaloneDialogflow) {
                jovo_core_1.Log.info();
                jovo_core_1.Log.info('INFO: Testing from the Dialogflow console has limited functionality.');
                jovo_core_1.Log.info();
            }
            if ((requestObject.queryResult &&
                requestObject.originalDetectIntentRequest &&
                requestObject.session &&
                requestObject.originalDetectIntentRequest.source === this.factory.type()) ||
                notStandaloneDialogflow) {
                // creates a platform instance, e.g. GoogleAction
                handleRequest.jovo = this.factory.createPlatformRequest(handleRequest.app, handleRequest.host, handleRequest);
            }
        };
        this.request = (jovo) => {
            jovo.$request = this.factory.createRequest(jovo.$host.getRequestObject());
            jovo.$originalRequest = jovo.$request.originalDetectIntentRequest.payload;
            jovo.$response = this.factory.createResponse();
        };
        this.type = (jovo) => {
            if (jovo.$request &&
                (!jovo.$type.type || jovo.$type.type === jovo_core_1.EnumRequestType.UNKNOWN_REQUEST)) {
                if (jovo.$request.getIntentName() === 'Default Welcome Intent') {
                    jovo.$type = {
                        type: jovo_core_1.EnumRequestType.LAUNCH,
                    };
                }
                else if (!jovo.$type.type || jovo.$type.type === jovo_core_1.EnumRequestType.UNKNOWN_REQUEST) {
                    //TODO:
                    jovo.$type = {
                        type: jovo_core_1.EnumRequestType.INTENT,
                    };
                }
            }
        };
        this.nlu = (jovo) => {
            let nluData = new jovo_core_1.NluData();
            if (jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
                nluData = {
                    intent: {
                        name: jovo.$request.getIntentName(),
                    },
                };
            }
            jovo.$nlu = nluData;
        };
        this.inputs = (jovo) => {
            if (jovo.$request) {
                jovo.$inputs = jovo.$request.getInputs();
            }
        };
        this.session = (jovo) => {
            if (jovo.$request) {
                const dialogflowRequest = jovo.$request;
                const sessionContext = dialogflowRequest.getSessionContext();
                if (sessionContext) {
                    jovo.$session.$data = sessionContext.parameters;
                    // remove parameter values from session object
                    for (const parameter of Object.keys(dialogflowRequest.getParameters())) {
                        delete jovo.$session.$data[parameter];
                        delete jovo.$session.$data[parameter + '.original'];
                    }
                    jovo.$requestSessionAttributes = JSON.parse(JSON.stringify(jovo.$session.$data));
                }
            }
        };
        this.output = (jovo) => {
            const output = jovo.$output;
            const request = jovo.$request;
            const response = jovo.$response;
            const originalResponse = jovo.$originalResponse;
            if (output.tell) {
                response.fulfillmentText = output.tell.speech.toString();
                response.end_interaction = true;
            }
            if (output.ask) {
                response.fulfillmentText = output.ask.speech.toString();
                response.end_interaction = false;
            }
            // TODO: testme
            if (originalResponse) {
                if (originalResponse.sessionEntityTypes) {
                    // set session entities
                    // @ts-ignore
                    response.sessionEntityTypes = originalResponse.sessionEntityTypes;
                    delete originalResponse.sessionEntityTypes;
                }
                if (originalResponse.hasSessionEnded() &&
                    !_get(jovo.$app.config, 'keepSessionDataOnSessionEnded')) {
                    _set(response, 'outputContexts', _get(request, 'queryResult.outputContexts'));
                    response.outputContexts = request.queryResult.outputContexts;
                    return;
                }
            }
            const outputContexts = request.queryResult.outputContexts || [];
            const sessionContextPrefix = `${request.session}/contexts/_jovo_session_`;
            // remove non-jovo contexts
            const newOutputContexts = outputContexts.filter((context) => {
                return (!context.name.startsWith(sessionContextPrefix) &&
                    context.lifespanCount &&
                    context.lifespanCount > 0);
            });
            // add jovo session context
            if (Object.keys(jovo.$session.$data).length > 0) {
                newOutputContexts.push({
                    name: `${sessionContextPrefix}${jovo_core_1.Util.randomStr(5)}`,
                    lifespanCount: 1,
                    parameters: jovo.$session.$data,
                });
            }
            if (jovo.$output.Dialogflow && jovo.$output.Dialogflow.OutputContexts) {
                for (let i = 0; i < jovo.$output.Dialogflow.OutputContexts.length; i++) {
                    const contextObj = jovo.$output.Dialogflow.OutputContexts[i];
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
            response.outputContexts = newOutputContexts;
        };
        this.response = (jovo) => {
            if (jovo.$originalResponse) {
                if (this.factory.type()) {
                    jovo.$response.payload = {
                        [this.factory.type()]: jovo.$originalResponse,
                    };
                }
            }
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.init = this.init.bind(this);
        this.request = this.request.bind(this);
        this.type = this.type.bind(this);
        this.nlu = this.nlu.bind(this);
        this.inputs = this.inputs.bind(this);
        this.output = this.output.bind(this);
        this.session = this.session.bind(this);
        this.response = this.response.bind(this);
    }
    install(platform) {
        platform.middleware('$init').use(this.init);
        platform.middleware('$request').use(this.request);
        platform.middleware('$type').use(this.type);
        platform.middleware('$nlu').use(this.nlu);
        platform.middleware('$inputs').use(this.inputs);
        platform.middleware('$output').use(this.output);
        platform.middleware('$session').use(this.session);
        platform.middleware('$response').use(this.response);
        platform.requestBuilder = new index_1.DialogflowRequestBuilder(this.factory);
        platform.responseBuilder = new DialogflowResponseBuilder_1.DialogflowResponseBuilder(this.factory);
    }
}
exports.DialogflowPlugin = DialogflowPlugin;
//# sourceMappingURL=DialogflowPlugin.js.map