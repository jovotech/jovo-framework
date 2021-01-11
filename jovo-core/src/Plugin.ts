import _merge from 'lodash.merge';
import { DeepPartial } from '.';
import { Extensible } from './Extensible';

export type PluginConstructor<T extends Plugin = Plugin> = new (
  config?: DeepPartial<T['config']>,
  ...args: unknown[]
) => T;

export interface PluginConfig {
  [key: string]: unknown;
  enabled?: boolean;
}

export abstract class Plugin<C extends PluginConfig = PluginConfig> {
  readonly config: C;
  readonly initConfig?: DeepPartial<C>;

  constructor(config?: DeepPartial<C>) {
    this.initConfig = config;
    const defaultConfig = this.getDefaultConfig();
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  abstract getDefaultConfig(): C;

  initialize?(parent: Extensible): Promise<void>;

  abstract mounted(parent: Extensible): Promise<void> | void;
  demounted?(parent?: Extensible): Promise<void> | void;
}
