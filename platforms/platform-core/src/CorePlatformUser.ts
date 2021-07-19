import { JovoUser } from '@jovotech/framework';
import { CorePlatformResponse } from '@jovotech/output-core';
import { Core } from './Core';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformUser extends JovoUser<
  CorePlatformRequest,
  CorePlatformResponse,
  Core
> {
  constructor(jovo: Core) {
    super(jovo);
  }

  get id(): string {
    return 'coreplatformuser';
  }
}
