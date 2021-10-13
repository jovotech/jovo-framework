import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { FacebookMessenger } from './FacebookMessenger';

export type FacebookMessengerCapabilityType = CapabilityType;

export class FacebookMessengerDevice extends JovoDevice<
  FacebookMessenger,
  FacebookMessengerCapabilityType
> {}
