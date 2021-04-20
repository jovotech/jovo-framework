import { JovoUser } from '@jovotech/core';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatformApp } from './CorePlatformApp';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformUser extends JovoUser<CorePlatformRequest, CorePlatformResponse> {
  constructor(jovo: CorePlatformApp) {
    super(jovo);
  }

  get id(): string {
    return 'coreplatformuser';
  }
}
