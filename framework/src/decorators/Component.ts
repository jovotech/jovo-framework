import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { BuiltInHandler } from '../enums';
import { DuplicateChildComponentsError } from '../errors/DuplicateChildComponentsError';
import { ComponentMetadata, ComponentOptionsOf } from '../metadata/ComponentMetadata';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { HandlerOptionMetadata } from '../metadata/HandlerOptionMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { getMethodKeys } from '../utilities';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Component<COMPONENT extends BaseComponent = any>(
  options?: ComponentOptionsOf<COMPONENT>,
): (target: ComponentConstructor<COMPONENT>) => void {
  return function (target) {
    if (options?.components) {
      const componentNameSet = new Set<string>();
      options.components.forEach((component) => {
        const componentName =
          typeof component === 'function'
            ? component.name
            : component.options?.name || component.component.name;
        if (componentNameSet.has(componentName)) {
          throw new DuplicateChildComponentsError(componentName, target.name);
        }
        componentNameSet.add(componentName);
      });
    }
    const metadataStorage = MetadataStorage.getInstance();

    const keys = getMethodKeys(target.prototype);
    // iterate all keys of methods of the target
    keys.forEach((key) => {
      const hasHandlerMetadata = metadataStorage.handlerMetadata.some(
        (handlerMetadata) =>
          handlerMetadata.target === target && handlerMetadata.propertyKey === key,
      );
      const hasHandlerOptionMetadata = metadataStorage.handlerOptionMetadata.some(
        (optionMetadata) => optionMetadata.target === target && optionMetadata.propertyKey === key,
      );

      // if it is LAUNCH or END
      if (key === BuiltInHandler.Launch || key === BuiltInHandler.End) {
        // unshift to not overwrite any other explicitly set HandlerOptionMetadata when merging
        metadataStorage.handlerOptionMetadata.unshift(
          new HandlerOptionMetadata(target, key as keyof COMPONENT, {
            global: true,
            types: [key],
          }) as HandlerOptionMetadata,
        );
      } else if (!hasHandlerMetadata && !hasHandlerOptionMetadata) {
        metadataStorage.addHandlerMetadata(new HandlerMetadata(target, key as keyof COMPONENT));
      }
    });
    metadataStorage.addComponentMetadata(new ComponentMetadata<COMPONENT>(target, options));
    return;
  };
}
