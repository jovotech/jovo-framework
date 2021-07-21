import { CorePlatformResponse } from '@jovotech/output-core';

import { Capability, JovoDevice } from '@jovotech/framework';
import { CorePlatformRequest } from './CorePlatformRequest';
import { CorePlatformApp } from './CorePlatformApp';

export type CorePlatformCapability = Capability;

export class CorePlatformDevice extends JovoDevice<
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformApp,
  CorePlatformCapability
> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
