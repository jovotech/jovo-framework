import { JovoUser } from '@jovotech/framework';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatformApp } from './CorePlatformApp';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformUser extends JovoUser<
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformApp
> {
  get id(): string {
    return 'coreplatformuser';
  }
}
