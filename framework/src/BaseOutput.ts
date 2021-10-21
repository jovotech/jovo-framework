import { JovoResponse, OutputTemplate } from '@jovotech/output';
import { DeepPartial } from '@jovotech/framework';
import _merge from 'lodash.merge';
import { JovoRequest } from './index';
import { Jovo } from './Jovo';
import { JovoProxy } from './JovoProxy';

export type OutputConstructor<
  OUTPUT extends BaseOutput = BaseOutput,
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE> = Jovo<REQUEST, RESPONSE>,
> = new (jovo: JOVO, options?: DeepPartial<OUTPUT['options']>, ...args: unknown[]) => OUTPUT;

export interface OutputOptions extends OutputTemplate {}

export abstract class BaseOutput<OPTIONS extends OutputOptions = OutputOptions> extends JovoProxy {
  readonly options: OPTIONS;

  constructor(jovo: Jovo, options?: DeepPartial<OPTIONS>) {
    super(jovo);
    const defaultOptions = this.getDefaultOptions();
    this.options = options ? _merge(defaultOptions, options) : defaultOptions;
  }

  getDefaultOptions(): OPTIONS {
    return {} as OPTIONS;
  }

  abstract build(): OutputTemplate | OutputTemplate[] | Promise<OutputTemplate | OutputTemplate[]>;
}
