import { Jovo } from '@jovotech/framework';
import { CoreDevice } from './CoreDevice';
import { CorePlatform } from './CorePlatform';
import { CoreRequest } from './CoreRequest';
import { CoreResponse } from './CoreResponse';
import { CoreUser } from './CoreUser';

export class Core extends Jovo<
  CoreRequest,
  CoreResponse,
  Core,
  CoreUser,
  CoreDevice,
  CorePlatform
> {}
