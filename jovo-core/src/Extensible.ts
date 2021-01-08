import { DeepPartial } from '.';
import { Plugin, PluginConfig } from './Plugin';

export interface ExtensiblePluginConfig {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: object | undefined;
}

export interface ExtensibleConfig extends PluginConfig {
  plugin?: ExtensiblePluginConfig;
}

export interface ExtensibleInitConfig {
  plugins?: Plugin[];
  plugin?: never;
}

export abstract class Extensible<C extends ExtensibleConfig = ExtensibleConfig> extends Plugin<C> {
  plugins: Record<string, Plugin> = {};

  constructor(config?: DeepPartial<Omit<C & ExtensibleInitConfig, 'plugin'>>) {
    super(config ? { ...config, plugins: undefined } : config);
    if (this.config && 'plugins' in this.config) {
      delete this.config.plugins;
    }
    if (this.initConfig && 'plugins' in this.initConfig) {
      delete this.initConfig.plugins;
    }
    if (config?.plugins && (config?.plugins as Plugin[] | undefined)?.length) {
      this.use(...(config.plugins as Plugin[]));
    }
  }

  use<T extends Plugin[]>(...plugins: T): this {
    for (let i = 0, len = plugins.length; i < len; i++) {
      const name = plugins[i].constructor.name;
      this.plugins[name] = plugins[i];
    }
    return this;
  }

  async initializePlugins(): Promise<void> {
    for (const key in this.plugins) {
      if (this.plugins.hasOwnProperty(key)) {
        const plugin = this.plugins[key];

        // TODO determine whether this is the way we want to retrieve the config
        // maybe a merge should happen here instead
        const config = {
          ...(plugin.initConfig
            ? plugin.config
            : this.config.plugin?.[key]
            ? this.config.plugin[key]
            : plugin.config),
        };

        Object.assign(plugin, { config });
        if (!this.config.plugin) {
          this.config.plugin = {};
        }
        this.config.plugin[key] = config;

        if (plugin.initialize) {
          await plugin.initialize(this);
        }

        if (plugin instanceof Extensible && Object.keys(plugin.plugins).length) {
          await plugin.initializePlugins();
        }
      }
    }
  }
}
