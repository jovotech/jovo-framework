import { AnyObject, Constructor } from '@jovotech/framework';
import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';

export abstract class MethodDecoratorMetadata<
  TARGET = AnyObject,
  KEY extends keyof TARGET = keyof TARGET,
> extends ClassDecoratorMetadata<TARGET> {
  protected constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: Constructor<TARGET> | Function,
    readonly propertyKey: KEY,
  ) {
    super(target);
  }

  hasSameTargetAs(otherMetadata: MethodDecoratorMetadata): boolean {
    return this.target === otherMetadata.target && this.propertyKey === otherMetadata.propertyKey;
  }
}
