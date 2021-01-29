import { BaseComponent, ComponentConstructor, ComponentOptions } from '../../../BaseComponent';

export class ComponentMetadata<COMPONENT extends BaseComponent = BaseComponent> {
  readonly options?: ComponentOptions<COMPONENT>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    options?: ComponentOptions<COMPONENT>,
  ) {
    if (options) {
      this.options = options;
    }
  }
}
