import { AlexaResponse } from '@jovotech/output-alexa';

import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';
import { Capability, JovoDevice } from '@jovotech/framework';

export type AlexaCapability = Capability | 'Alexa.Apl';

export class AlexaDevice extends JovoDevice<
  AlexaRequest,
  AlexaResponse,
  AlexaSkill,
  AlexaCapability
> {
  constructor(jovo: AlexaSkill) {
    super(jovo);

    this.applyDataFromRequest();
  }

  get id(): string | undefined {
    return this.jovo.$request.context?.System.device.deviceId;
  }

  applyDataFromRequest(): void {
    const supportedInterfaces = this.jovo.$request.context?.System?.device?.supportedInterfaces;

    if (supportedInterfaces?.AudioPlayer) {
      this.addCapability('audio', 'long-form-audio');
    }

    if (supportedInterfaces?.['Alexa.Presentation.APL']) {
      this.addCapability('screen', 'Alexa.Apl');
    }
  }
}
