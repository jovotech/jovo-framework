import { Plugin, BaseApp, SpeechBuilder, Log } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');
import { Config } from '../../DialogflowCore';
import { Dialogflow } from '../../Dialogflow';
import { DialogflowAgent } from '../../DialogflowAgent';
import { DialogflowPhoneGatewayUser as DialogflowPhoneGatewayUser } from './DialogflowPhoneGatewayUser';
import { DialogflowResponse } from '../..';

/*
export interface DialogflowPhoneGatewayConfig extends Config {
  source: string;
}
*/

export class DialogflowPhoneGateway implements Plugin {
  config = {
    enabled: true,
  };

  constructor(config?: Config) {}

  install(dialogFlow: Dialogflow) {
    dialogFlow.middleware('$output')!.use(this.output.bind(this));
    dialogFlow.middleware('$type')!.use(this.type.bind(this));

    DialogflowAgent.prototype.isDialogflowPhoneGateway = function () {
      return _get(this.$request, 'originalDetectIntentRequest.source') === 'GOOGLE_TELEPHONY';
    };
  }
  uninstall(app: BaseApp) {}

  type(dialogflowAgent: DialogflowAgent) {
    if (dialogflowAgent.isDialogflowPhoneGateway()) {
      dialogflowAgent.$user = new DialogflowPhoneGatewayUser(dialogflowAgent);
    }
  }

  output(dialogflowAgent: DialogflowAgent) {
    if (dialogflowAgent.isDialogflowPhoneGateway()) {
      const output = dialogflowAgent.$output;

      if (!dialogflowAgent.$response) {
        dialogflowAgent.$response = new DialogflowResponse();
      }

      const response = dialogflowAgent.$response as DialogflowResponse;

      if (response.fulfillmentText && SpeechBuilder.isSSML(response.fulfillmentText)) {
        const ssml = response.fulfillmentText;

        if (!response.fulfillmentMessages) {
          response.fulfillmentMessages = [];
        }

        response.fulfillmentMessages.push(
          {
            platform: 'TELEPHONY',
            telephonySynthesizeSpeech: {
              ssml,
            }
          }
        );

        response.fulfillmentText = SpeechBuilder.removeSSML(response.fulfillmentText);
      } else {
        Log.info("Response does not contain SSML");
      }
    }
  }
}
