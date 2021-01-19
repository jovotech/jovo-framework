import _merge from 'lodash.merge';
import { DeepPartial } from '.';
import { MiddlewareCollection } from './MiddlewareCollection';
import { Plugin, PluginConfig } from './Plugin';

export interface ExtensiblePluginConfig {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: object | undefined;
}

export interface ExtensiblePlugins {
  [key: string]: Plugin | undefined;
}

export interface ExtensibleConfig extends PluginConfig {
  plugin?: ExtensiblePluginConfig;
}

export interface ExtensibleInitConfig {
  plugins?: Plugin[];
  plugin?: never;
}

export abstract class Extensible<
  C extends ExtensibleConfig = ExtensibleConfig,
  N extends string[] = string[]
> extends Plugin<C> {
  readonly plugins: ExtensiblePlugins;

  abstract readonly middlewareCollection: MiddlewareCollection<N>;

  constructor(config?: DeepPartial<Omit<C & ExtensibleInitConfig, 'plugin'>>) {
    super(config ? { ...config, plugins: undefined } : config);
    this.plugins = {};
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

  use(...plugins: Plugin[]): this {
    for (let i = 0, len = plugins.length; i < len; i++) {
      const name = plugins[i].constructor.name;
      this.plugins[name] = plugins[i];
    }
    return this;
  }

  protected async initializePlugins(): Promise<void> {
    for (const key in this.plugins) {
      if (this.plugins.hasOwnProperty(key)) {
        const plugin = this.plugins[key];
        if (!plugin) {
          continue;
        }

        // merge config, priority: 1. constructor, 2. parent-config, 3. default-config
        const config = plugin.initConfig
          ? _merge({}, this.config.plugin?.[key] || {}, plugin.config)
          : _merge({}, plugin.config, this.config.plugin?.[key] || {});

        Object.defineProperty(plugin, 'config', {
          enumerable: true,
          value: config,
          writable: false,
        });
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

  protected async mountPlugins(): Promise<void> {
    for (const key in this.plugins) {
      if (this.plugins.hasOwnProperty(key)) {
        const plugin = this.plugins[key];
        if (!plugin) {
          continue;
        }

        const config = plugin.config;

        Object.defineProperty(plugin, 'config', {
          enumerable: true,
          value: config,
          writable: false,
        });
        await plugin.mount(this);

        if (!this.config.plugin) {
          this.config.plugin = {};
        }
        this.config.plugin[key] = config;

        if (plugin instanceof Extensible && (plugin as Extensible).plugins) {
          await plugin.mountPlugins();
        }
      }
    }
  }
}
