import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';
import { ComponentOptions } from './ComponentMetadata';
import { MetadataStorage } from './MetadataStorage';

export function createComponentOptionDecorator<COMPONENT extends BaseComponent = BaseComponent>(
  options: Partial<ComponentOptions<COMPONENT>>,
): ClassDecorator {
  return function (target) {
    MetadataStorage.getInstance().addComponentOptionMetadata(
      new ComponentOptionMetadata<COMPONENT>(target, options),
    );
  };
}

export class ComponentOptionMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
> extends ClassDecoratorMetadata<COMPONENT> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    readonly options: Partial<ComponentOptions<COMPONENT>> = {},
  ) {
    super(target);
  }
}
