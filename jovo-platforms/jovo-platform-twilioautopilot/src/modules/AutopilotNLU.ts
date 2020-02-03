import { Plugin, EnumRequestType } from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
import { AutopilotRequest } from '../core/AutopilotRequest';

export class AutopilotNLU implements Plugin {
  install(autopilot: Autopilot) {
    autopilot.middleware('$nlu')!.use(this.nlu.bind(this));
    autopilot.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(autopilot: Autopilot) {}

  async nlu(autopilotBot: AutopilotBot) {
    const autopilotRequest = autopilotBot.$request as AutopilotRequest;
    if (autopilotBot.$type?.type === EnumRequestType.INTENT) {
      autopilotBot.$nlu = {
        intent: {
          name: autopilotRequest.getIntentName(),
        },
      };
    }
  }

  async inputs(autopilotBot: AutopilotBot) {
    const autopilotRequest = autopilotBot.$request as AutopilotRequest;
    autopilotBot.$inputs = autopilotRequest.getInputs();
  }
}
