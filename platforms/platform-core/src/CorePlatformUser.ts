import { JovoUser } from '@jovotech/framework';
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

  get id(): string {
    return 'coreplatformuser';
  }
}
