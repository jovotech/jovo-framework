import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';

export abstract class MethodDecoratorMetadata<
  TARGET extends any = any,
  KEY extends keyof TARGET = keyof TARGET,
> extends ClassDecoratorMetadata {
  protected constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: (new (...args: unknown[]) => TARGET) | Function,
    readonly propertyKey: KEY,
  ) {
    super(target);
  }

  hasSameTargetAs(otherMetadata: MethodDecoratorMetadata): boolean {
    return this.target === otherMetadata.target && this.propertyKey === otherMetadata.propertyKey;
  }
}
