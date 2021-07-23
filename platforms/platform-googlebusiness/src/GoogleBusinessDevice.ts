import { Capability, JovoDevice } from '@jovotech/framework';
import { GoogleBusiness } from './GoogleBusiness';

export type GoogleBusinessCapability = Capability;

export class GoogleBusinessDevice extends JovoDevice<GoogleBusiness, GoogleBusinessCapability> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
