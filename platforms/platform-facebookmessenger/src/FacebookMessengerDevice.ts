import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';

import { Capability, JovoDevice } from '@jovotech/framework';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { MessengerBot } from './MessengerBot';

export type FacebookMessengerCapability = Capability;

export class FacebookMessengerDevice extends JovoDevice<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  MessengerBot,
  FacebookMessengerCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
