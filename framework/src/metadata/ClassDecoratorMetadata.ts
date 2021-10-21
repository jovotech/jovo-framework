import { AnyObject, Constructor } from '@jovotech/common';

export abstract class ClassDecoratorMetadata<TARGET = AnyObject> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected constructor(readonly target: Constructor<TARGET> | Function) {}

  hasSameTargetAs(otherMetadata: ClassDecoratorMetadata): boolean {
    return this.target === otherMetadata.target;
  }
}
