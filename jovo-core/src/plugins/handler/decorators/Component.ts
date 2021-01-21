import { BaseComponent, ComponentConstructor, ComponentOptions } from '../../../BaseComponent';
import { ComponentMetadata } from '../metadata/ComponentMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function Component<COMPONENT extends BaseComponent = BaseComponent>(
  options?: ComponentOptions<COMPONENT>,
): (target: ComponentConstructor<COMPONENT>) => void {
  return function (target) {
    MetadataStorage.getInstance().componentMetadata.push(
      new ComponentMetadata<COMPONENT>(target, options),
    );
    return;
  };
}
