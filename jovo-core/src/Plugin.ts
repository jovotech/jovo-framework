import _merge from 'lodash.merge';
import { DeepPartial } from '.';
import { Extensible } from './Extensible';

export type PluginConstructor<T extends Plugin = Plugin> = new (
  config?: DeepPartial<T['config']>,
  ...args: unknown[]
) => T;

export interface PluginConfig {
  enabled?: boolean;

  [key: string]: unknown;
}

export abstract class Plugin<C extends PluginConfig = PluginConfig> {
  [key: string]: unknown;

  readonly config: C;
  readonly initConfig?: DeepPartial<C>;

  constructor(config?: DeepPartial<C>) {
    this.initConfig = config;
    const defaultConfig = this.getDefaultConfig();
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  abstract getDefaultConfig(): C;

  initialize?(parent: Extensible): Promise<void>;

  abstract mount(parent: Extensible): Promise<void> | void;

  dismount?(parent?: Extensible): Promise<void> | void;
}
