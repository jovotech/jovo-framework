import { BaseComponent, ComponentConstructor, ComponentMetadata } from '../../../BaseComponent';

export function Component<COMPONENT extends BaseComponent = BaseComponent>(
  metadata?: ComponentMetadata<COMPONENT>,
): (target: ComponentConstructor<COMPONENT>) => void {
  return function (target) {
    console.log(target);

    return;
  };
}
