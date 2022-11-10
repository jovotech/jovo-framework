import { AnyObject, Constructor } from '@jovotech/common';
import { ParameterDecoratorMetadata } from './ParameterDecoratorMetadata';
import { InjectionToken } from './InjectableMetadata';

export class InjectMetadata<TARGET = AnyObject> extends ParameterDecoratorMetadata<TARGET> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: Constructor<TARGET> | Function,
    readonly index: number,
    readonly token: InjectionToken,
  ) {
    super(target, index);
  }
}
