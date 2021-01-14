import { Component } from './Component';
import { Extensible, ExtensibleConfig } from './Extensible';
import { MiddlewareCollection } from './MiddlewareCollection';

export abstract class ComponentPlugin<
  C extends ExtensibleConfig = ExtensibleConfig
> extends Extensible<C> {
  abstract readonly component: typeof Component;

  readonly middlewareCollection = new MiddlewareCollection();

  get name(): string {
    return this.constructor.name;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mount(): void | Promise<void> {}
}
