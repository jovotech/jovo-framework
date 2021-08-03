import { Capability, JovoDevice } from '@jovotech/framework';
import { Alexa } from './Alexa';

export type AlexaCapability = Capability | 'alexa:apl';

export class AlexaDevice extends JovoDevice<Alexa, AlexaCapability> {
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
