import { AnyObject, Constructor } from '@jovotech/common';
import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';

export abstract class ParameterDecoratorMetadata<
  TARGET = AnyObject,
> extends ClassDecoratorMetadata {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected constructor(readonly target: Constructor<TARGET> | Function, readonly index: number) {
    super(target);
  }

  hasSameTargetAs(otherMetadata: ParameterDecoratorMetadata): boolean {
    return this.target === otherMetadata.target && this.index === otherMetadata.index;
  }
}
