import _merge from 'lodash.merge';
import { DeepPartial } from '.';
import { Extensible } from './Extensible';

export interface PluginConfig {
  [key: string]: unknown;

  enabled?: boolean;
  skipTests?: boolean;
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

  /**
   * Lifecycle Hook: Called when the plugin is installed via `use`.
   * Has to be synchronous.
   * @param parent
   */
  install?(parent: Extensible): void;

  /**
   * Lifecycle Hook: Called when the App is initialized and every child plugin is initialized.
   * Can be asynchronous. This hook should be used for time-consuming actions like API-calls.
   * @param parent
   */
  initialize?(parent: Extensible): Promise<void> | void;

  /**
   * Lifecycle Hook: Called when a copy of every plugin is created and mounted onto HandleRequest.
   * This happens on every request.
   * Can be asynchronous.
   * @param parent
   */
  mount?(parent: Extensible): Promise<void> | void;

  dismount?(parent?: Extensible): Promise<void> | void;
}
