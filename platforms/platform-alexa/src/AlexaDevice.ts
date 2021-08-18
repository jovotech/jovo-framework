import { Capability, JovoDevice } from '@jovotech/framework';
import { Alexa } from './Alexa';

export enum AlexaCapability {
  Apl = 'ALEXA:APL',
}

export type AlexaCapabilityType = Capability | AlexaCapability;

export class AlexaDevice extends JovoDevice<Alexa, AlexaCapabilityType> {
  get id(): string | undefined {
    return this.jovo.$request.context?.System.device.deviceId;
  }

  setCapabilitiesFromRequest(): void {
    const supportedInterfaces = this.jovo.$request.context?.System?.device?.supportedInterfaces;
    this.addCapability(Capability.Audio);

    if (supportedInterfaces?.AudioPlayer) {
      this.addCapability(Capability.LongformAudio);
    }

    if (supportedInterfaces?.['Alexa.Presentation.APL']) {
      this.addCapability(Capability.Screen, AlexaCapability.Apl);
    }
  }
}
