import { DeepPartial } from '.';
import { Extensible } from './Extensible';

// eslint-disable-next-line @typescript-eslint/ban-types
export type PluginConstructor<C extends object = object, T extends Plugin<C> = Plugin<C>> = new (
  config: DeepPartial<C>,
) => T;

// eslint-disable-next-line @typescript-eslint/ban-types
export interface PluginDefinition<C extends object = object, T extends Plugin<C> = Plugin<C>> {
  resolve: PluginConstructor<C, T>;
  plugins?: Array<PluginDefinition | PluginConstructor>;
  config?: C;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface Plugin<C extends object = object> {
  readonly config: C;

  getDefaultConfig(): C;

  initialize?(parent: Extensible): Promise<void>;

  install(parent: Extensible): Promise<void> | void;

  uninstall?(parent?: Extensible): Promise<void> | void;
}
