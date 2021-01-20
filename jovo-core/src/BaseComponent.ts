import _merge from 'lodash.merge';
import { App } from './App';
import { HandleRequest } from './HandleRequest';
import { DeepPartial } from './index';
import { Jovo } from './Jovo';
import { Platform } from './Platform';
import { PluginConfig } from './Plugin';

export type ComponentConstructor<COMPONENT extends BaseComponent = BaseComponent> = new (
  app: App,
  handleRequest: HandleRequest,
  platform: Platform,
  config?: DeepPartial<COMPONENT['config']>,
  ...args: unknown[]
) => COMPONENT;

export interface ComponentMetadata<COMPONENT extends BaseComponent = BaseComponent> {
  config?: DeepPartial<COMPONENT['config']>;
  components?: Array<ComponentConstructor | ComponentDeclaration>;
}

export class ComponentDeclaration<
  COMPONENT_CONSTRUCTOR extends ComponentConstructor = ComponentConstructor
> {
  constructor(
    readonly component: COMPONENT_CONSTRUCTOR,
    readonly metadata?: ComponentMetadata<InstanceType<COMPONENT_CONSTRUCTOR>>,
  ) {}
}

export abstract class BaseComponent<CONFIG extends PluginConfig = PluginConfig> extends Jovo {
  readonly config: CONFIG;

  constructor(
    app: App,
    handleRequest: HandleRequest,
    platform: Platform,
    config?: DeepPartial<CONFIG>,
  ) {
    super(app, handleRequest, platform);
    const defaultConfig = this.getDefaultConfig();
    // TODO maybe set a direct reference from constructor instead
    // Components will most likely only be initialized during the request ...
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  abstract getDefaultConfig(): CONFIG;
}
