import { AlexaResponse } from '@jovotech/output-alexa';

import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';
import { Capability, JovoDevice } from '@jovotech/framework';

export type AlexaCapability = Capability | 'alexa:apl';

export class AlexaDevice extends JovoDevice<
  AlexaRequest,
  AlexaResponse,
  AlexaSkill,
  AlexaCapability
> {
  get id(): string | undefined {
    return this.jovo.$request.context?.System.device.deviceId;
  }

  setCapabilitiesFromRequest(): void {
    const supportedInterfaces = this.jovo.$request.context?.System?.device?.supportedInterfaces;

    if (supportedInterfaces?.AudioPlayer) {
      this.addCapability('audio', 'long-form-audio');
    }

    if (supportedInterfaces?.['Alexa.Presentation.APL']) {
      this.addCapability('screen', 'Alexa.Apl');
    }
  }
}
