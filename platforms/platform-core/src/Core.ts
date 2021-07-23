import { Jovo } from '@jovotech/framework';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatform } from './CorePlatform';
import { CorePlatformDevice } from './CorePlatformDevice';
import { CorePlatformRequest } from './CorePlatformRequest';
import { CorePlatformUser } from './CorePlatformUser';

export class Core extends Jovo<
  CorePlatformRequest,
  CorePlatformResponse,
  Core,
  CorePlatformUser,
  CorePlatformDevice,
  CorePlatform
> {}
