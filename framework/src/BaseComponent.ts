import { UnknownObject } from '@jovotech/common';
import { ComponentData, ComponentOptions, JovoComponentInfo } from './index';
import { Jovo } from './Jovo';
import { JovoProxy } from './JovoProxy';
import { ComponentOptionsOf } from './metadata/ComponentMetadata';

// JovoComponentInfo.config is optional, therefore we need to exclude undefined
// Otherwise the config-type will always be an union type like config | undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentConfig<COMPONENT extends BaseComponent = any> = Exclude<
  COMPONENT['$component']['config'],
  undefined
>;

export type ComponentConstructor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  COMPONENT extends BaseComponent = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ARGS extends unknown[] = any[],
> = new (
  jovo: Jovo,
  options: ComponentOptionsOf<COMPONENT> | undefined,
  ...args: ARGS
) => COMPONENT;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ComponentDeclaration<COMPONENT extends BaseComponent = any> {
  constructor(
    readonly component: ComponentConstructor<COMPONENT>,
    readonly options?: ComponentOptionsOf<COMPONENT>,
  ) {}
}

export abstract class BaseComponent<
  DATA extends ComponentData = ComponentData,
  CONFIG extends UnknownObject = UnknownObject,
> extends JovoProxy {
  constructor(jovo: Jovo, readonly options: ComponentOptions<CONFIG> | undefined) {
    super(jovo);
  }

  get $component(): JovoComponentInfo<DATA, CONFIG> {
    return {
      data: this.jovo.$component.data as DATA,
      config: { ...(this.options?.config || {}), ...(this.jovo.$component.config || {}) } as CONFIG,
    };
  }
}
