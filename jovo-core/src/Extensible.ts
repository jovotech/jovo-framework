import _defaultsDeep from 'lodash.defaultsdeep';
import { DeepPartial } from './index';
import { Plugin } from './Plugin';

export interface ExtensiblePluginConfig {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: object | undefined;
}

export interface ExtensibleConfig {
  plugin?: ExtensiblePluginConfig;
}

export abstract class Extensible<C extends ExtensibleConfig = ExtensibleConfig>
  implements Plugin<C> {
  readonly config: C;
  plugins: Record<string, Plugin> = {};

  constructor(config: DeepPartial<C>) {
    const defaultConfig = this.getDefaultConfig();
    this.config = _defaultsDeep(config, defaultConfig);
  }

  abstract getDefaultConfig(): C;

  initialize?(parent: Extensible): Promise<void>;

  abstract install(parent: Extensible): Promise<void> | void;

  uninstall?(extensible?: Extensible): Promise<void> | void;
}
