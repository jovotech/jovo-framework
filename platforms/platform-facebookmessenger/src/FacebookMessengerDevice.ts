import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';

import { Capability, JovoDevice } from '@jovotech/framework';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessenger } from './FacebookMessenger';

export type FacebookMessengerCapability = Capability;

export class FacebookMessengerDevice extends JovoDevice<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
