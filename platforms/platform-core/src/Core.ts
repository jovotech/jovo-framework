import { Jovo } from '@jovotech/framework';
import { CoreResponse } from '.';
import { CoreDevice } from './CoreDevice';
import { CorePlatform } from './CorePlatform';
import { CoreRequest } from './CoreRequest';
import { CoreUser } from './CoreUser';

export class Core extends Jovo<
  CoreRequest,
  CoreResponse,
  Core,
  CoreUser,
  CoreDevice,
  CorePlatform
> {}
