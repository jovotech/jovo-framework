import { ComponentData, JovoComponentInfo, UnknownObject } from './index';
import { Jovo } from './Jovo';
import { JovoProxy } from './JovoProxy';
import { ComponentOptions } from './metadata/ComponentMetadata';

export type ComponentConstructor<COMPONENT extends BaseComponent = BaseComponent> = new (
  jovo: Jovo,
  options?: ComponentOptions<COMPONENT>,
  ...args: unknown[]
) => COMPONENT;

export type ComponentConfig<COMPONENT extends BaseComponent = BaseComponent> =
  COMPONENT['$component']['config'];

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
  get $component(): JovoComponentInfo<DATA, CONFIG> {
    return this.$component as { data: DATA; config: CONFIG | undefined };
  }
}
