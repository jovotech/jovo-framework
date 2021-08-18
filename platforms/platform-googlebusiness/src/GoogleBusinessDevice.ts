import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { GoogleBusiness } from './GoogleBusiness';

export type GoogleBusinessCapabilityType = CapabilityType;

export class GoogleBusinessDevice extends JovoDevice<GoogleBusiness, GoogleBusinessCapabilityType> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
