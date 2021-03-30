import _merge from 'lodash.merge';
import { DeepPartial, OutputTemplate } from './index';
import { Jovo } from './Jovo';
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

export abstract class BaseComponent<CONFIG extends PluginConfig = PluginConfig> extends Jovo {
  readonly config: CONFIG;

  constructor(readonly jovo: Jovo, config?: DeepPartial<CONFIG>) {
    super(jovo.$app, jovo.$handleRequest, jovo.$platform);
    // Make `this[key]` reference `jovo[key]` for every `key` in `jovo`. Without, mutations of `this` would not change `jovo`.
    // TODO: check if functions should be ignored
    for (const key in jovo) {
      if (
        jovo.hasOwnProperty(key) &&
        typeof (jovo as any)[key] !== 'function' &&
        (this as any)[key] &&
        key !== 'jovo'
      ) {
        Object.defineProperty(this, key, {
          get() {
            return this.jovo[key];
          },
          set(val: any) {
            this.jovo[key] = val;
          },
        });
      }
    }
    const defaultConfig = this.getDefaultConfig();
    // TODO maybe set a direct reference from constructor instead
    // Components will most likely only be initialized during the request ...
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  getDefaultConfig(): CONFIG {
    return {} as CONFIG;
  }
}
