import { EnumRequestType, JovoError, Plugin, PluginConfig } from 'jovo-core';
import { FacebookMessenger, MessengerBot, MessengerBotRequest } from '../../src';

interface Config extends PluginConfig {}

export class RequestSLU implements Plugin {
  config: Config = {};

  install(messenger: FacebookMessenger) {
    messenger.middleware('$nlu')!.use(this.nlu.bind(this));
    messenger.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async nlu(messengerBot: MessengerBot) {
    const request = messengerBot.$request!;

    let intentName = 'DefaultFallbackIntent';
    if (request.getIntentName()) {
      intentName = request.getIntentName()!;
    } else if (messengerBot.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (messengerBot.$type.type === EnumRequestType.END) {
      intentName = 'END';
    }

    messengerBot.$nlu = {
      intent: {
        name: intentName,
      },
    };
  }

  async inputs(messengerBot: MessengerBot) {
    const request = messengerBot.$request as MessengerBotRequest;
    if (!messengerBot.$nlu && messengerBot.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No nlu data to get inputs off was given.');
    } else if (
      messengerBot.$type.type === EnumRequestType.LAUNCH ||
      messengerBot.$type.type === EnumRequestType.END
    ) {
      messengerBot.$inputs = {};
      return;
    }

    messengerBot.$inputs = request.getInputs() || {};
  }
}
