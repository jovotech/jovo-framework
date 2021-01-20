import _merge from 'lodash.merge';
import { DeepPartial } from '.';
import { Extensible } from './Extensible';

export interface PluginConfig {
  [key: string]: unknown;

  enabled?: boolean;
}

export abstract class Plugin<CONFIG extends PluginConfig = PluginConfig> {
  [key: string]: unknown;

  readonly config: CONFIG;
  readonly initConfig?: DeepPartial<CONFIG>;

  constructor(config?: DeepPartial<CONFIG>) {
    this.initConfig = config;
    const defaultConfig = this.getDefaultConfig();
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  abstract getDefaultConfig(): CONFIG;

  install?(parent: Extensible): void;

  initialize?(parent: Extensible): Promise<void>;

  abstract mount(parent: Extensible): Promise<void> | void;

  dismount?(parent?: Extensible): Promise<void> | void;
}
