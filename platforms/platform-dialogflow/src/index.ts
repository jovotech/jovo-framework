import { isNode } from '@jovotech/framework';
import type { DialogflowCli as DialogflowCliType } from './cli';

export const DialogflowCli: typeof DialogflowCliType = isNode()
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./cli').DialogflowCli
  : null;
