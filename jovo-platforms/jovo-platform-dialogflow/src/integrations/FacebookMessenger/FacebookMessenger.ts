import { Plugin, BaseApp, Jovo, EnumRequestType } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');
import { Config } from '../../DialogflowCore';
import { Dialogflow } from '../../Dialogflow';
import { DialogflowAgent } from '../../DialogflowAgent';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { DialogflowResponse } from '../..';

declare module './../../DialogflowAgent' {
  interface DialogflowAgent {
    isFacebookMessengerBot(): boolean;
  }
}

export class FacebookMessenger implements Plugin {
  config: Config = {
    enabled: true,
  };

  constructor(config?: Config) {}

  install(dialogFlow: Dialogflow) {
    dialogFlow.middleware('$output')!.use(this.output.bind(this));
    dialogFlow.middleware('$type')!.use(this.type.bind(this));

    DialogflowAgent.prototype.isFacebookMessengerBot = function () {
      return _get(this.$request, 'originalDetectIntentRequest.source') === 'facebook';
    };
  }
  uninstall(app: BaseApp) {}
  type(dialogflowAgent: DialogflowAgent) {
    if (dialogflowAgent.isFacebookMessengerBot()) {
      dialogflowAgent.$user = new FacebookMessengerUser(dialogflowAgent);
    }
  }

  output(dialogflowAgent: DialogflowAgent) {
    if (dialogflowAgent.isFacebookMessengerBot()) {
      const output = dialogflowAgent.$output;

      const isFacebookMessengerRequest =
        _get(dialogflowAgent.$request, 'originalDetectIntentRequest.source') === 'facebook';

      if (!isFacebookMessengerRequest) {
        return;
      }

      if (!dialogflowAgent.$response) {
        dialogflowAgent.$response = new DialogflowResponse();
      }

      if (_get(output, 'Dialogflow.Payload.facebook')) {
        _set(
          dialogflowAgent.$response,
          'payload.facebook',
          _get(output, 'Dialogflow.Payload.facebook'),
        );
      }

      if (output.tell) {
        _set(dialogflowAgent.$response, 'payload.facebook.text', `${output.tell.speech}`);
      }

      if (output.ask) {
        _set(dialogflowAgent.$response, 'payload.facebook.text', `${output.ask.speech}`);
      }
    }
  }
}
