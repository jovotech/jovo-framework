import { Alexa } from '../Alexa';
import { Plugin, EnumRequestType, Input } from 'jovo-core';
import { AlexaRequest } from '../core/AlexaRequest';
import { AlexaSkill } from '../core/AlexaSkill';

export class AlexaNlu implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$nlu')!.use(this.nlu.bind(this));
    alexa.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(alexa: Alexa) {}

  async nlu(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    if (alexaSkill.$type && alexaSkill.$type.type === EnumRequestType.INTENT) {
      alexaSkill.$nlu = {
        intent: {
          name: alexaRequest.getIntentName(),
        },
      };
    }
  }

  inputs(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    alexaSkill.$inputs = alexaRequest.getInputs();
  }
}
