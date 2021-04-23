import { JovoUser } from '@jovotech/core';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatformApp } from './CorePlatformApp';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformUser extends JovoUser<
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformApp
> {
  constructor(jovo: CorePlatformApp) {
    super(jovo);
  }
}
