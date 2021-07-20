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
  constructor(jovo: CorePlatformApp) {
    super(jovo);

    this.applyDataFromRequest();
  }

  applyDataFromRequest(): void {
    // needs to be implemented
  }
}
