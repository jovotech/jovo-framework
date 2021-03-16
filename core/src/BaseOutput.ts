import { OutputTemplate } from '@jovotech/output';
import { DeepPartial } from './index';
import { Jovo } from './Jovo';

export interface OutputOptions {
  [key: string]: unknown;
}

export abstract class BaseOutput<OPTIONS extends OutputOptions = OutputOptions> extends Jovo {
  readonly options: OPTIONS;

  constructor(jovo: Jovo, options?: DeepPartial<OPTIONS>) {
    super(jovo.$app, jovo.$handleRequest, jovo.$platform);

  }

  abstract build(): OutputTemplate | Promise<OutputTemplate>;
}
