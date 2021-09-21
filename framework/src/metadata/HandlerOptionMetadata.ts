import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { HandleOptions } from './HandlerMetadata';
import { MetadataStorage } from './MetadataStorage';
import { MethodDecoratorMetadata } from './MethodDecoratorMetadata';

/**
 * Get values of the rest parameter of a decorator.
 * Useful for following case:
 * `@Intent(['foo', 'bar'])` in this case, the actual value in the intents-parameter is `[ ['foo', 'bar'] ]`, therefore we only need to return the inner array.
 */
export function getValuesOfDecoratorRestParameter<T>(restParameter: T[] | T[][]): T[] {
  return restParameter.length && Array.isArray(restParameter[0])
    ? restParameter[0]
    : (restParameter as T[]);
}

export function createHandlerOptionDecorator<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT,
>(options: Partial<HandleOptions>): MethodDecorator {
  return function (target, propertyKey) {
    MetadataStorage.getInstance().addHandlerOptionMetadata(
      new HandlerOptionMetadata<COMPONENT, KEY>(target.constructor, propertyKey as KEY, options),
    );
  };
}

export class HandlerOptionMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT,
> extends MethodDecoratorMetadata<COMPONENT, KEY> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    readonly propertyKey: KEY,
    readonly options: Partial<HandleOptions> = {},
  ) {
    super(target, propertyKey);
  }
}
