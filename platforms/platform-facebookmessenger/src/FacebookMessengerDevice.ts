import { Capability, JovoDevice } from '@jovotech/framework';
import { FacebookMessenger } from './FacebookMessenger';

export type FacebookMessengerCapability = Capability;

export class FacebookMessengerDevice extends JovoDevice<
  FacebookMessenger,
  FacebookMessengerCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
