import { BaseOutput, OutputConstructor } from '../BaseOutput';

export class OutputMetadata<OUTPUT extends BaseOutput = BaseOutput> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(readonly target: OutputConstructor<OUTPUT> | Function, readonly name: string) {}
}
