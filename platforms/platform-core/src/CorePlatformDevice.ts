import { CorePlatformResponse } from '@jovotech/output-core';

import { Capability, JovoDevice } from '@jovotech/framework';
import { CorePlatformRequest } from './CorePlatformRequest';
import { Core } from './Core';

export type CorePlatformCapability = Capability;

export class CorePlatformDevice extends JovoDevice<
  CorePlatformRequest,
  CorePlatformResponse,
  Core,
  CorePlatformCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
