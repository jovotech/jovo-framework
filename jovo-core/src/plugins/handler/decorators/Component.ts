import { BaseComponent, ComponentConstructor, ComponentOptions } from '../../../BaseComponent';
import { DuplicateChildComponentError } from '../../../errors/DuplicateChildComponentError';
import { ComponentMetadata } from '../metadata/ComponentMetadata';
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
          throw new DuplicateChildComponentError(componentName, target.name);
        }
        componentNameSet.add(componentName);
      }
    }

    MetadataStorage.getInstance().addComponentMetadata(
      new ComponentMetadata<COMPONENT>(target, options),
    );
    return;
  };
}
