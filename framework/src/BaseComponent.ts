import { DeepPartial, UnknownObject } from '@jovotech/common';
import { ComponentData, JovoComponentInfo } from './index';
import { Jovo } from './Jovo';
import { JovoProxy } from './JovoProxy';
import { ComponentOptions } from './metadata/ComponentMetadata';

export type ComponentConfig<COMPONENT extends BaseComponent = BaseComponent> =
  COMPONENT['$component']['config'];

export type ComponentConstructor<COMPONENT extends BaseComponent = BaseComponent> = new (
  jovo: Jovo,
  config?: DeepPartial<ComponentConfig<COMPONENT>>,
) => COMPONENT;

export class ComponentDeclaration<
  COMPONENT_CONSTRUCTOR extends ComponentConstructor = ComponentConstructor,
> {
  constructor(
    readonly component: COMPONENT_CONSTRUCTOR,
    readonly options?: ComponentOptions<InstanceType<COMPONENT_CONSTRUCTOR>>,
  ) {}
}

export abstract class BaseComponent<
  DATA extends ComponentData = ComponentData,
  CONFIG extends UnknownObject = UnknownObject,
> extends JovoProxy {
  constructor(jovo: Jovo, readonly initConfig?: DeepPartial<CONFIG>) {
    super(jovo);
  }

  get $component(): JovoComponentInfo<DATA, CONFIG> {
    return {
      data: this.jovo.$component.data as DATA,
      config: { ...this.initConfig, ...(this.jovo.$component.config || {}) } as CONFIG,
    };
  }
}
