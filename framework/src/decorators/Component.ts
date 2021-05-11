import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { InternalIntent } from '../enums';
import { DuplicateChildComponentsError } from '../errors/DuplicateChildComponentsError';
import { ComponentMetadata, ComponentOptions } from '../metadata/ComponentMetadata';
import { HandlerOptionMetadata } from '../metadata/HandlerOptionMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function Component<COMPONENT extends BaseComponent = BaseComponent>(
  options?: ComponentOptions<COMPONENT>,
): (target: ComponentConstructor<COMPONENT>) => void {
  return function (target) {
    if (options?.components) {
      const componentNameSet = new Set<string>();
      for (let i = 0, len = options.components.length; i < len; i++) {
        const component = options.components[i];
        const componentName =
          typeof component === 'function'
            ? component.name
            : component.options?.name || component.component.name;
        if (componentNameSet.has(componentName)) {
          throw new DuplicateChildComponentsError(componentName, target.name);
        }
        componentNameSet.add(componentName);
      }
    }
    const metadataStorage = MetadataStorage.getInstance();
    // make launch global if it is set
    if (target.prototype[InternalIntent.Launch]) {
      // unshift to not overwrite any other explicitly set HandlerOptionMetadata when merging
      metadataStorage.handlerOptionMetadata.unshift(
        new HandlerOptionMetadata(target, InternalIntent.Launch as keyof COMPONENT, {
          global: true,
        }) as HandlerOptionMetadata,
      );
    }
    metadataStorage.addComponentMetadata(new ComponentMetadata<COMPONENT>(target, options));
    return;
  };
}
