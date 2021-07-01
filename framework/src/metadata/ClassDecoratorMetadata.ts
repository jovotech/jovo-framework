export abstract class ClassDecoratorMetadata<TARGET extends any = any> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected constructor(readonly target: (new (...args: unknown[]) => TARGET) | Function) {}

  hasSameTargetAs(otherMetadata: ClassDecoratorMetadata): boolean {
    return this.target === otherMetadata.target;
  }
}
