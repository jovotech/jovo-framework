import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';

import { Capability, JovoDevice } from '@jovotech/framework';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
import { GoogleBusiness } from './GoogleBusiness';

export type GoogleBusinessCapability = Capability;

export class GoogleBusinessDevice extends JovoDevice<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusiness,
  GoogleBusinessCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
