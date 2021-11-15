import type { DialogflowCli as DialogflowCliType } from './cli';

export const DialogflowCli: typeof DialogflowCliType = process.env.JOVO_CLI_RUNTIME
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./cli').DialogflowCli
  : null;

export * from './DialogflowResponse';
export * from './output';
