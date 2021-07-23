import { Jovo } from '@jovotech/framework';
import { CorePlatform } from './CorePlatform';
import { CoreDevice } from './CoreDevice';
import { CoreRequest } from './CoreRequest';
import { CoreUser } from './CoreUser';
import { CoreResponse } from '.';

export class Core extends Jovo<
  CoreRequest,
  CoreResponse,
  Core,
  CoreUser,
  CoreDevice,
  CorePlatform
> {}
