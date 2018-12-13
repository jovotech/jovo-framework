import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');
import _mapValues = require('lodash.mapvalues');

import {
    Extensible,
    HandleRequest, Jovo, Platform
} from "jovo-core";
import {DialogflowRequest} from "./core/DialogflowRequest";
import {EnumRequestType, NLUData, ExtensibleConfig} from "jovo-core";
import {DialogflowResponse} from "./core/DialogflowResponse";
import {DialogflowRequestBuilder} from "./core/DialogflowRequestBuilder";
import {DialogflowResponseBuilder} from "./core/DialogflowResponseBuilder";

export interface DialogflowNluConfig extends ExtensibleConfig {
    sessionContextId?: string;
    platformClazz?: Jovo;
    platformRequestClazz?: any; // tslint:disable-line
    platformResponseClazz?: any; // tslint:disable-line
    platformId?: string;
}

class Dialogflow {
    jovo: Jovo;
    platform: string;
    $request: DialogflowRequest;
    $response: DialogflowResponse;

    constructor(jovo: Jovo) {
        this.jovo = jovo;
        this.$request = DialogflowRequest.fromJSON(jovo.$host.getRequestObject()) as DialogflowRequest;
        this.platform = this.$request.originalDetectIntentRequest.source;
        this.$response = new DialogflowResponse();
    }
}

export class DialogflowNlu extends Extensible {

    config: DialogflowNluConfig = {
        enabled: true,
        sessionContextId: 'session',

        plugin: {},
    };

    constructor(config?: DialogflowNluConfig) {
        super(config);

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

    install(platform: Extensible) {

        // @ts-ignore
        platform.requestBuilder = new DialogflowRequestBuilder();
        // @ts-ignore
        platform.requestBuilder.platform = 'google';
        // @ts-ignore
        platform.requestBuilder.platformRequestClazz = this.config.platformRequestClazz;
        // @ts-ignore
        platform.responseBuilder = new DialogflowResponseBuilder();
        // @ts-ignore
        platform.responseBuilder.platform = 'google';
        // @ts-ignore
        platform.responseBuilder.platformResponseClazz = this.config.platformResponseClazz;

        platform.middleware('$init')!.use(this.init);

        // // Register to Platform middleware
        platform.middleware('$request')!.use(this.request);
        platform.middleware('$type')!.use(this.type);
        platform.middleware('$nlu')!.use(this.nlu);
        platform.middleware('$inputs')!.use(this.inputs);

        platform.middleware('$output')!.use(this.output);
        platform.middleware('$session')!.use(this.session);

        platform.middleware('$response')!.use(this.response);
        Object.assign(Jovo.prototype, {
            dialogflow() {
                return this.$plugins.DialogflowNlu.dialogflow;
            }
        });
    }
    uninstall(platform: Extensible) {
        platform.middleware('$init')!.remove(this.init);

        // // Register to Platform middleware
        platform.middleware('$request')!.remove(this.request);
        platform.middleware('$type')!.remove(this.type);
        platform.middleware('$nlu')!.remove(this.nlu);
        platform.middleware('$inputs')!.remove(this.inputs);

        platform.middleware('$output')!.remove(this.output);
        platform.middleware('$session')!.remove(this.session);

        platform.middleware('$response')!.remove(this.response);
    }

    init = async (handleRequest: HandleRequest) => {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject.queryResult &&
            requestObject.originalDetectIntentRequest &&
            requestObject.session) {

            handleRequest.jovo = new handleRequest.platformClazz(handleRequest.app, handleRequest.host);
            _set(handleRequest.jovo.$plugins, 'DialogflowNlu.dialogflow', new Dialogflow(handleRequest.jovo));
        }
    };

    request = (jovo: Jovo) => {
        jovo.$originalRequest = _get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'originalDetectIntentRequest.payload');
        jovo.$request = jovo.$plugins.DialogflowNlu.dialogflow.$request;
        (jovo.$request as DialogflowRequest).originalDetectIntentRequest.payload = this.config.platformRequestClazz.fromJSON(jovo.$originalRequest );
        // _set(jovo.$request, 'originalDetectIntentRequest.payload', jovo.platformRequest.fromJSON(jovo.$originalRequest ));
    };

    type = (jovo: Jovo) => {
        if (_get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'queryResult.intent')) {
            if (_get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'queryResult.intent.displayName') === 'Default Welcome Intent') {
                jovo.$type = {
                    type: EnumRequestType.LAUNCH
                };
            } else if (_get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'queryResult.intent.isFallback', false) === false) {

                if (_get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'queryResult.intent.displayName') === 'Default Fallback Intent' &&
                    jovo.$type) {

                } else {
                    jovo.$type = {
                        type: EnumRequestType.INTENT
                    };
                }
            }
        }
    };

    nlu = (jovo: Jovo) => {
        const nluData: NLUData = {

        };
        if (jovo.$type.type === EnumRequestType.INTENT) {
            _set(nluData, 'intent.name', _get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'queryResult.intent.displayName'));
        }
        jovo.$nlu = nluData;
    };

    inputs = (jovo: Jovo) => {
        const params = _get(jovo.$plugins.DialogflowNlu.dialogflow.$request, 'queryResult.parameters');
        jovo.$inputs = _mapValues(params, (value, name) => {
            return {
                name,
                value,
                key: value, // Added for cross platform consistency
                id: value, // Added for cross platform consistency
            };
        });
    };

    session = async (jovo: Jovo) => {
        const dialogflowRequest = jovo.$plugins.DialogflowNlu.dialogflow.$request;

        const sessionId = _get(dialogflowRequest, 'session');

        if (_get(dialogflowRequest, 'queryResult.outputContexts')) {
            const sessionContext =_get(dialogflowRequest, 'queryResult.outputContexts').find((context: any) => { // tslint:disable-line
                return context.name === `${sessionId}/contexts/${this.config.sessionContextId}`;
            });

            if (sessionContext) {
                jovo.$session.$data = sessionContext.parameters;

                for (const parameter of Object.keys(_get(dialogflowRequest, 'queryResult.parameters'))) {
                    delete jovo.$session.$data[parameter];
                    delete jovo.$session.$data[parameter + '.original'];
                }
            }
            jovo.$requestSessionAttributes = JSON.parse(JSON.stringify(jovo.$session.$data));
        }
    };

    output = (jovo: Jovo) => {
        const output = jovo.$output;
        const dialogflowResponse = jovo.$plugins.DialogflowNlu.dialogflow.$response;
        const dialogflowRequest = jovo.$plugins.DialogflowNlu.dialogflow.$request;
        const sessionId = _get(dialogflowRequest, 'session');

        if (_get(output, 'tell')) {
            _set(dialogflowResponse, 'fulfillmentText', `<speak>${output.tell.speech}</speak>`);
        }
        if (_get(output, 'ask')) {
            _set(dialogflowResponse, 'fulfillmentText', `<speak>${output.ask.speech}</speak>`);
        }

        const outputContexts = _get(dialogflowRequest, 'queryResult.outputContexts');
        const contextName = `${sessionId}/contexts/${this.config.sessionContextId}`;

        if (outputContexts && Object.keys(jovo.$session.$data).length > 0) {
            const sessionContext = outputContexts.find((context: any) => { // tslint:disable-line
                return context.name === contextName;
            });

            if (sessionContext) {
                outputContexts.forEach((context: any) => { // tslint:disable-line
                    if (context.name === contextName) {
                        context.parameters = jovo.$session.$data;
                    }
                });
            } else {
                outputContexts.push({
                    name: contextName,
                    lifespanCount: 1000,
                    parameters: jovo.$session.$data
                });
            }
        }
        _set(dialogflowResponse, 'outputContexts', _get(dialogflowRequest, 'queryResult.outputContexts'));
    };


    response = async (jovo: Jovo) => {
        (jovo.$plugins.DialogflowNlu.dialogflow.$response as DialogflowResponse).payload = {
            [this.config.platformId]: this.config.platformResponseClazz.fromJSON(jovo.$response )
        };
        jovo.$response = jovo.$plugins.DialogflowNlu.dialogflow.$response;
    };

}
