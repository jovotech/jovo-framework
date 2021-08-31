import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { Alexa } from './Alexa';

export enum AlexaCapability {
  Apl = 'ALEXA:APL',
}

export type AlexaCapabilityType = CapabilityType | AlexaCapability | `${AlexaCapability}`;

export class AlexaDevice extends JovoDevice<Alexa, AlexaCapabilityType> {
  get id(): string | undefined {
    return this.jovo.$request.context?.System.device.deviceId;
  }
}
