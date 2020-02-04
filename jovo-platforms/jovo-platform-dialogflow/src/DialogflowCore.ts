import { BaseApp, EnumRequestType, NluData, Plugin, PluginConfig, Util } from 'jovo-core';
import { Dialogflow } from './Dialogflow';
import { DialogflowAgent } from './DialogflowAgent';
import { Context, DialogflowRequest } from './core/DialogflowRequest';
import { DialogflowResponse } from './core/DialogflowResponse';
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface Config extends PluginConfig {
  sessionContextId?: string;
}

export class DialogflowCore implements Plugin {
  config: Config = {
    enabled: true,
    sessionContextId: '_jovo_session_',
  };

  constructor(config?: Config) {}

  install(dialogFlow: Dialogflow) {
    dialogFlow.middleware('$request')!.use(this.request.bind(this));
    dialogFlow.middleware('$type')!.use(this.type.bind(this));
    dialogFlow.middleware('$session')!.use(this.session.bind(this));

    dialogFlow.middleware('$nlu')!.use(this.nlu.bind(this));
    dialogFlow.middleware('$inputs')!.use(this.inputs.bind(this));
    dialogFlow.middleware('$output')!.use(this.output.bind(this));
  }
  uninstall(app: BaseApp) {}

  request(dialogflowAgent: DialogflowAgent) {
    dialogflowAgent.$request = DialogflowRequest.fromJSON(
      dialogflowAgent.$host.$request,
    ) as DialogflowRequest;
  }

  type(dialogflowAgent: DialogflowAgent) {
    const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;

    if (_get(dialogflowRequest, 'queryResult.intent')) {
      if (_get(dialogflowRequest, 'queryResult.intent.displayName') === 'Default Welcome Intent') {
        dialogflowAgent.$type = {
          type: EnumRequestType.LAUNCH,
        };
      } else {
        dialogflowAgent.$type = {
          type: EnumRequestType.INTENT,
        };
      }
    }
  }

  nlu(dialogflowAgent: DialogflowAgent) {
    const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
    const nluData = new NluData();
    if (dialogflowAgent.$type.type === EnumRequestType.INTENT) {
      _set(nluData, 'intent.name', _get(dialogflowRequest, 'queryResult.intent.displayName'));
    }
    dialogflowAgent.$nlu = nluData;
  }

  inputs(dialogflowAgent: DialogflowAgent) {
    const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
    dialogflowAgent.$inputs = dialogflowRequest.getInputs();
  }

  session(dialogflowAgent: DialogflowAgent) {
    const dialogflowRequest = dialogflowAgent.$request as DialogflowRequest;
    const sessionId = _get(dialogflowRequest, 'session');
    const sessionKey = `${sessionId}/contexts/${this.config.sessionContextId}`;
    if (_get(dialogflowRequest, 'queryResult.outputContexts')) {
      const sessionContext = _get(dialogflowRequest, 'queryResult.outputContexts').find(
        // tslint:disable-next-line
        (context: any) => {
          return context.name.startsWith(sessionKey);
        },
      );

      if (sessionContext) {
        dialogflowAgent.$session.$data = sessionContext.parameters;

        for (const parameter of Object.keys(_get(dialogflowRequest, 'queryResult.parameters'))) {
          delete dialogflowAgent.$session.$data[parameter];
          delete dialogflowAgent.$session.$data[parameter + '.original'];
        }
      }
      dialogflowAgent.$requestSessionAttributes = JSON.parse(
        JSON.stringify(dialogflowAgent.$session.$data),
      );
    }
  }

  output(dialogflowAgent: DialogflowAgent) {
    const output = dialogflowAgent.$output;
    const request = dialogflowAgent.$request as DialogflowRequest;

    if (!dialogflowAgent.$response) {
      dialogflowAgent.$response = new DialogflowResponse();
    }

    if (output.tell) {
      (dialogflowAgent.$response as DialogflowResponse).fulfillmentText = output.tell.speech.toString();
    }

    if (output.ask) {
      (dialogflowAgent.$response as DialogflowResponse).fulfillmentText = output.ask.speech.toString();
    }

    const outputContexts = request.queryResult.outputContexts || [];

    const sessionContextPrefix = `${request.session}/contexts/${this.config.sessionContextId}`;

    // remove non-jovo contexts
    const newOutputContexts = outputContexts.filter((context: Context) => {
      return (
        !context.name.startsWith(sessionContextPrefix) &&
        context.lifespanCount &&
        context.lifespanCount > 0
      );
    });

    // add ask context
    if (output.ask) {
      newOutputContexts.push({
        name: `${request.session}/contexts/_jovo_ask_${Util.randomStr(5)}`,
        lifespanCount: 1,
        parameters: { ask: true },
      });
    }

    // add jovo session context
    if (Object.keys(dialogflowAgent.$session.$data).length > 0) {
      newOutputContexts.push({
        name: `${sessionContextPrefix}${Util.randomStr(5)}`,
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

    (dialogflowAgent.$response as DialogflowResponse).outputContexts = newOutputContexts;

    if (_get(output, 'Dialogflow.Payload')) {
      _set(dialogflowAgent.$response, 'payload', _get(output, 'Dialogflow.Payload'));
    }
  }
}
