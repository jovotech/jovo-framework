import _merge from 'lodash.merge';
import { DeepPartial } from './index';
import { Jovo } from './Jovo';
import { PluginConfig } from './Plugin';
import { ComponentMetadata } from './plugins/handler/metadata/ComponentMetadata';

export interface RegisteredComponents {
  [key: string]: ComponentMetadata | undefined;
}

export type ComponentConstructor<COMPONENT extends BaseComponent = BaseComponent> = new (
  jovo: Jovo,
  config?: DeepPartial<COMPONENT['config']>,
  ...args: unknown[]
) => COMPONENT;

export interface ComponentOptions<COMPONENT extends BaseComponent = BaseComponent> {
  name?: string;
  config?: DeepPartial<COMPONENT['config']>;
  components?: Array<ComponentConstructor | ComponentDeclaration>;
  models?: Record<string, any>;
}

export class ComponentDeclaration<
  COMPONENT_CONSTRUCTOR extends ComponentConstructor = ComponentConstructor
> {
  constructor(
    readonly component: COMPONENT_CONSTRUCTOR,
    readonly options?: ComponentOptions<InstanceType<COMPONENT_CONSTRUCTOR>>,
  ) {}
}

export abstract class BaseComponent<CONFIG extends PluginConfig = PluginConfig> extends Jovo {
  readonly config: CONFIG;

  constructor(jovo: Jovo, config?: DeepPartial<CONFIG>) {
    super(jovo.$app, jovo.$handleRequest, jovo.$platform);
    const defaultConfig = this.getDefaultConfig();
    // TODO maybe set a direct reference from constructor instead
    // Components will most likely only be initialized during the request ...
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  getDefaultConfig(): CONFIG {
    return {} as CONFIG;
  }
}
