import { DeepPartial, UnknownObject } from '@jovotech/common';
import { ComponentData, ComponentOptions, JovoComponentInfo } from './index';
import { Jovo } from './Jovo';
import { JovoProxy } from './JovoProxy';
import { ComponentOptionsOf } from './metadata/ComponentMetadata';

export type ComponentConfig<COMPONENT extends BaseComponent = BaseComponent> =
  COMPONENT['$component']['config'];

export type ComponentConstructor<COMPONENT extends BaseComponent = BaseComponent> = new (
  jovo: Jovo,
  options?: ComponentOptionsOf<COMPONENT>,
) => COMPONENT;

export class ComponentDeclaration<
  COMPONENT_CONSTRUCTOR extends ComponentConstructor = ComponentConstructor,
> {
  constructor(
    readonly component: COMPONENT_CONSTRUCTOR,
    readonly options?: ComponentOptionsOf<InstanceType<COMPONENT_CONSTRUCTOR>>,
  ) {}
}

export abstract class BaseComponent<
  DATA extends ComponentData = ComponentData,
  CONFIG extends UnknownObject = UnknownObject,
> extends JovoProxy {
  constructor(jovo: Jovo, readonly options?: ComponentOptions<CONFIG>) {
    super(jovo);
  }

  get $component(): JovoComponentInfo<DATA, CONFIG> {
    return {
      data: this.jovo.$component.data as DATA,
      config: { ...(this.options?.config || {}), ...(this.jovo.$component.config || {}) } as CONFIG,
    };
  }
}
