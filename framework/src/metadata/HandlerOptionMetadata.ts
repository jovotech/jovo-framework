import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { HandleOptions } from './HandlerMetadata';
import { MetadataStorage } from './MetadataStorage';
import { MethodDecoratorMetadata } from './MethodDecoratorMetadata';

export function createHandlerOptionDecorator<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT
>(options: Partial<HandleOptions>): MethodDecorator {
  return function (target, propertyKey) {
    MetadataStorage.getInstance().addHandlerOptionMetadata(
      new HandlerOptionMetadata<COMPONENT, KEY>(target.constructor, propertyKey as KEY, options),
    );
  };
}

export class HandlerOptionMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT
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
