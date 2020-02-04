import {
  EnumRequestType,
  Extensible,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Log,
  NluData,
  Platform,
  Util,
} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');
import {
  DialogflowRequest,
  DialogflowRequestBuilder,
  DialogflowResponse,
  PlatformFactory,
} from '../index';
import { DialogflowResponseBuilder } from '../core/DialogflowResponseBuilder';
import { Context } from '../core/DialogflowRequest';

export interface DialogflowPluginConfig extends ExtensibleConfig {
  sessionContextId?: string;
}

export class DialogflowPlugin<T extends Extensible> extends Extensible {
  config: DialogflowPluginConfig = {
    enabled: true,
  };

  constructor(config: DialogflowPluginConfig, private factory: PlatformFactory) {
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

  install(platform: Extensible & Platform) {
    platform.middleware('$init')!.use(this.init);
    platform.middleware('$request')!.use(this.request);
    platform.middleware('$type')!.use(this.type);
    platform.middleware('$nlu')!.use(this.nlu);
    platform.middleware('$inputs')!.use(this.inputs);
    platform.middleware('$output')!.use(this.output);
    platform.middleware('$session')!.use(this.session);
    platform.middleware('$response')!.use(this.response);
    platform.requestBuilder = new DialogflowRequestBuilder(this.factory);
    platform.responseBuilder = new DialogflowResponseBuilder(this.factory);
  }

  init = async (handleRequest: HandleRequest) => {
    const requestObject = handleRequest.host.getRequestObject();

    const isDialogflowOnlyRequest =
      requestObject.queryResult &&
      requestObject.originalDetectIntentRequest &&
      requestObject.session &&
      Object.keys(requestObject.originalDetectIntentRequest).length === 1;

    const notStandaloneDialogflow =
      !handleRequest.app.getPlatformByName('Dialogflow') && isDialogflowOnlyRequest;

    if (notStandaloneDialogflow) {
      Log.info();
      Log.info('INFO: Testing from the Dialogflow console has limited functionality.');
      Log.info();
    }

    if (
      (requestObject.queryResult &&
        requestObject.originalDetectIntentRequest &&
        requestObject.session &&
        requestObject.originalDetectIntentRequest.source === this.factory.type()) ||
      notStandaloneDialogflow
    ) {
      // creates a platform instance, e.g. GoogleAction
      handleRequest.jovo = this.factory.createPlatformRequest(
        handleRequest.app,
        handleRequest.host,
        handleRequest,
      );
    }
  };

  request = (jovo: Jovo) => {
    jovo.$request = this.factory.createRequest(jovo.$host.getRequestObject());
    jovo.$originalRequest = (jovo.$request as DialogflowRequest).originalDetectIntentRequest.payload;
    jovo.$response = this.factory.createResponse();
  };

  type = (jovo: Jovo) => {
    if (
      jovo.$request &&
      (!jovo.$type.type || jovo.$type.type === EnumRequestType.UNKNOWN_REQUEST)
    ) {
      if (jovo.$request.getIntentName() === 'Default Welcome Intent') {
        jovo.$type = {
          type: EnumRequestType.LAUNCH,
        };
      } else if (!jovo.$type.type || jovo.$type.type === EnumRequestType.UNKNOWN_REQUEST) {
        //TODO:
        jovo.$type = {
          type: EnumRequestType.INTENT,
        };
      }
    }
  };

  nlu = (jovo: Jovo) => {
    let nluData = new NluData();
    if (jovo.$type.type === EnumRequestType.INTENT) {
      nluData = {
        intent: {
          name: jovo.$request!.getIntentName() as string,
        },
      };
    }

    jovo.$nlu = nluData;
  };

  inputs = (jovo: Jovo) => {
    if (jovo.$request) {
      jovo.$inputs = jovo.$request.getInputs();
    }
  };

  session = (jovo: Jovo) => {
    if (jovo.$request) {
      const dialogflowRequest = jovo.$request as DialogflowRequest;

      const sessionContext = dialogflowRequest.getSessionContext();

      if (sessionContext) {
        jovo.$session.$data = sessionContext.parameters!;

        // remove parameter values from session object
        for (const parameter of Object.keys(dialogflowRequest.getParameters())) {
          delete jovo.$session.$data[parameter];
          delete jovo.$session.$data[parameter + '.original'];
        }

        jovo.$requestSessionAttributes = JSON.parse(JSON.stringify(jovo.$session.$data));
      }
    }
  };

  output = (jovo: Jovo) => {
    const output = jovo.$output;
    const request = jovo.$request as DialogflowRequest;

    const response = jovo.$response as DialogflowResponse;
    const originalResponse = jovo.$originalResponse as DialogflowResponse;

    if (output.tell) {
      response.fulfillmentText = output.tell.speech.toString();
    }

    if (output.ask) {
      response.fulfillmentText = output.ask.speech.toString();
    }

    // TODO: testme
    if (originalResponse) {
      if (originalResponse.sessionEntityTypes) {
        // set session entities
        // @ts-ignore
        response.sessionEntityTypes = originalResponse.sessionEntityTypes;
        delete originalResponse.sessionEntityTypes;
      }

      if (
        originalResponse.hasSessionEnded() &&
        !_get(jovo.$app.config, 'keepSessionDataOnSessionEnded')
      ) {
        _set(response, 'outputContexts', _get(request, 'queryResult.outputContexts'));
        response.outputContexts = request.queryResult.outputContexts;
        return;
      }
    }

    const outputContexts = request.queryResult.outputContexts || [];

    const sessionContextPrefix = `${request.session}/contexts/_jovo_session_`;

    // remove non-jovo contexts
    const newOutputContexts = outputContexts.filter((context: Context) => {
      return (
        !context.name.startsWith(sessionContextPrefix) &&
        context.lifespanCount &&
        context.lifespanCount > 0
      );
    });

    // add jovo session context
    if (Object.keys(jovo.$session.$data).length > 0) {
      newOutputContexts.push({
        name: `${sessionContextPrefix}${Util.randomStr(5)}`,
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
          if (
            (newOutputContexts[j] as Context) &&
            (newOutputContexts[j] as Context).name === outputContextName
          ) {
            (newOutputContexts[j] as Context).lifespanCount = contextObj.lifespanCount;
            (newOutputContexts[j] as Context).parameters = contextObj.parameters;
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

  response = (jovo: Jovo) => {
    if (jovo.$originalResponse) {
      if (this.factory.type()) {
        (jovo.$response as DialogflowResponse).payload = {
          [this.factory.type()]: jovo.$originalResponse,
        };
      }
    }
  };
}
