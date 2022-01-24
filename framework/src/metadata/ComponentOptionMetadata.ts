import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';
import { ComponentOptionsOf } from './ComponentMetadata';
import { MetadataStorage } from './MetadataStorage';

export function createComponentOptionDecorator<COMPONENT extends BaseComponent = BaseComponent>(
  options: Partial<ComponentOptionsOf<COMPONENT>>,
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
    readonly options: Partial<ComponentOptionsOf<COMPONENT>> = {},
  ) {
    super(target);
  }
}
