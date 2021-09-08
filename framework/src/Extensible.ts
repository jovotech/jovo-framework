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

export type ExtensibleInitConfig<CONFIG extends ExtensibleConfig = ExtensibleConfig> =
  DeepPartial<CONFIG> & {
    plugin?: never;
    plugins?: Plugin[];
  };

export abstract class Extensible<
  CONFIG extends ExtensibleConfig = ExtensibleConfig,
  MIDDLEWARES extends string[] = string[],
> extends Plugin<CONFIG> {
  readonly plugins: ExtensiblePlugins;
  readonly middlewareCollection: MiddlewareCollection<MIDDLEWARES>;

  constructor(config?: ExtensibleInitConfig<CONFIG>) {
    super(config ? { ...(config as DeepPartial<CONFIG>), plugins: undefined } : config);
    this.middlewareCollection = this.initializeMiddlewareCollection();
    this.plugins = {};
    if (config?.plugins && config?.plugins?.length) {
      this.use(...(config.plugins as Plugin[]));
    }
  }

  // TODO determine whether abstract or a default implementation should exist (that would most likely return an empty MiddlewareCollection)
  abstract initializeMiddlewareCollection(): MiddlewareCollection<MIDDLEWARES>;

  use(...plugins: Plugin[]): this {
    plugins.forEach((plugin) => {
      const name = plugin.constructor.name;
      this.plugins[name] = plugin;
      if (plugin.install) {
        plugin.install?.(this);
      }
    });
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
        });
        await plugin.mount?.(this);

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

  protected async dismountPlugins(): Promise<void> {
    for (const key in this.plugins) {
      if (this.plugins.hasOwnProperty(key)) {
        const plugin = this.plugins[key];
        if (!plugin) {
          continue;
        }
        await plugin.dismount?.(this);
        if (plugin instanceof Extensible && (plugin as Extensible).plugins) {
          await plugin.dismountPlugins();
        }
      }
    }
  }
}
