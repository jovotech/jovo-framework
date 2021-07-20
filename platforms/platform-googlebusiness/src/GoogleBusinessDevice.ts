import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';

import { Capability, JovoDevice } from '@jovotech/framework';
import { GoogleBusinessBot } from './GoogleBusinessBot';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export type GoogleBusinessCapability = Capability;

export class GoogleBusinessDevice extends JovoDevice<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusinessBot,
  GoogleBusinessCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
