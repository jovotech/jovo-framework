import { Plugin, BaseApp, SpeechBuilder, Log } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');
import _has = require('lodash.has');
import { Config } from '../../DialogflowCore';
import { Dialogflow } from '../../Dialogflow';
import { DialogflowAgent } from '../../DialogflowAgent';
import { GenesysUser } from './GenesysUser';
import { DialogflowResponse } from '../..';

/*
export interface GenesysConfig extends Config {
  source: string;
}
*/

export class Genesys implements Plugin {
  config = {
    enabled: true,
  };

  constructor(config?: Config) {}

  install(dialogFlow: Dialogflow) {
    dialogFlow.middleware('$output')!.use(this.output.bind(this));
    dialogFlow.middleware('$type')!.use(this.type.bind(this));

    DialogflowAgent.prototype.isGenesys = function () {
      return _has(this.$request, 'originalDetectIntentRequest.payload.Genesys-Conversation-Id');
    };
  }
  uninstall(app: BaseApp) {}

  type(dialogflowAgent: DialogflowAgent) {
    if (dialogflowAgent.isGenesys()) {
      dialogflowAgent.$user = new GenesysUser(dialogflowAgent);
    }
  }

  output(dialogflowAgent: DialogflowAgent) {
    if (dialogflowAgent.isGenesys()) {
      // TODO: Wrap in SSML Speak Tag if needed.
    }
  }
}
