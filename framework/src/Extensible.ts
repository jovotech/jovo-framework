import { DeepPartial } from '@jovotech/common';
import _merge from 'lodash.merge';
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

  abstract initializeMiddlewareCollection(): MiddlewareCollection<MIDDLEWARES>;

  use(...plugins: Plugin[]): this {
    plugins.forEach((plugin) => {
      const name = plugin.name;
      this.plugins[name] = plugin;
      plugin.install?.(this);
    });
    return this;
  }

  protected async initializePlugins(): Promise<void> {
    // for every child-plugin of this extensible
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

        // overwrite config, this is just used, because the config-property is readonly
        Object.defineProperty(plugin, 'config', {
          enumerable: true,
          value: config,
        });
        // if this extensible has no plugin-config for nested child-plugins, create it
        if (!this.config.plugin) {
          this.config.plugin = {};
        }
        // make plugin-config of this extensible aware of the child-plugin's config
        // this way the config-tree will be build with correct references
        this.config.plugin[key] = config;

        await plugin.initialize?.(this);

        // if the plugin extends Extensible and has installed child-plugins, initialize the plugin's child-plugins
        if (plugin instanceof Extensible && Object.keys(plugin.plugins).length) {
          await plugin.initializePlugins();
        }
      }
    }
  }

  protected async mountPlugins(): Promise<void> {
    // for every child-plugin of this extensible
    for (const key in this.plugins) {
      if (this.plugins.hasOwnProperty(key)) {
        const plugin = this.plugins[key];
        if (!plugin) {
          continue;
        }

        // if this extensible has no plugin-config for nested child-plugins, create it
        if (!this.config.plugin) {
          this.config.plugin = {};
        }
        // make plugin-config of this extensible aware of the child-plugin's config
        // this way the config-tree will be rebuild with correct references
        this.config.plugin[key] = plugin.config;

        await plugin.mount?.(this);

        // if the plugin extends Extensible and has installed child-plugins, mount the plugin's child-plugins
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
