import _merge from 'lodash.merge';
import { DeepPartial } from './index';
import { Jovo } from './Jovo';
import { JovoProxy } from './JovoProxy';
import { ComponentOptions, RegisteredComponentMetadata } from './metadata/ComponentMetadata';
import { PluginConfig } from './Plugin';

export interface RegisteredComponents {
  [key: string]: RegisteredComponentMetadata | undefined;
}

export type ComponentConstructor<COMPONENT extends BaseComponent = BaseComponent> = new (
  jovo: Jovo,
  config?: DeepPartial<COMPONENT['config']>,
  ...args: unknown[]
) => COMPONENT;

export class ComponentDeclaration<
  COMPONENT_CONSTRUCTOR extends ComponentConstructor = ComponentConstructor
> {
  constructor(
    readonly component: COMPONENT_CONSTRUCTOR,
    readonly options?: ComponentOptions<InstanceType<COMPONENT_CONSTRUCTOR>>,
  ) {}
}

export abstract class BaseComponent<CONFIG extends PluginConfig = PluginConfig> extends JovoProxy {
  readonly config: CONFIG;

  constructor(jovo: Jovo, config?: DeepPartial<CONFIG>) {
    super(jovo);

    // TODO maybe set a direct reference from constructor instead
    // Components will most likely only be initialized during the request ...
    const defaultConfig = this.getDefaultConfig();
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  getDefaultConfig(): CONFIG {
    return {} as CONFIG;
  }
}
