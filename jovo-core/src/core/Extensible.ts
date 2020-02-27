import * as EventEmitter from 'events';
import _cloneDeep = require('lodash.clonedeep');
import _isEqual = require('lodash.isequal');
import _merge = require('lodash.merge');
import _transform = require('lodash.transform');
import { ExtensiblePluginConfigs, Plugin, PluginConfig } from './../Interfaces';
import { Log } from './../util/Log';
import { ActionSet } from './ActionSet';
import { Middleware } from './Middleware';

export interface ExtensibleConfig extends PluginConfig {
  plugin?: ExtensiblePluginConfigs;
}

/**
 * Allows a class to use plugins
 */
export abstract class Extensible extends EventEmitter.EventEmitter implements Plugin {
  config: ExtensibleConfig = {
    enabled: true,
    plugin: {},
  };
  $plugins: Map<string, Plugin> = new Map();
  actionSet: ActionSet;

  constructor(config?: ExtensibleConfig) {
    super();
    this.setMaxListeners(0);
    // TODO: statement below could be deleted: the values set here are overridden by the config property in the extending classes
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.actionSet = new ActionSet([], this);
  }

  /**
   * Adds plugin to base class
   * @param {Plugin} plugins
   * @returns {this}
   */
  use(...plugins: Plugin[]): this {
    for (const plugin of plugins) {
      const name = plugin.name || plugin.constructor.name;
      if (plugin.config) {
        const constructor = plugin.constructor as new () => Plugin;
        const emptyPluginObject = new constructor();

        const defaultConfig = _cloneDeep(emptyPluginObject.config!);

        if (typeof defaultConfig.enabled === 'undefined') {
          defaultConfig.enabled = true;
        }

        if (typeof plugin.config.enabled === 'undefined') {
          plugin.config.enabled = true;
        }

        const localAppConfig = _cloneDeep(this.config);

        const constructorConfig = difference(plugin.config, defaultConfig);
        const appConfig = localAppConfig.plugin ? localAppConfig.plugin[name] : {};

        plugin.config = _merge(defaultConfig, appConfig, constructorConfig);

        if (!this.config.plugin) {
          this.config.plugin = {};
        }

        this.config.plugin[name] = plugin.config;
      }

      // remove existing plugin with the same name
      if (this.$plugins.get(name)) {
        const existingPlugin = this.$plugins.get(name);

        if (existingPlugin && existingPlugin.uninstall) {
          existingPlugin.uninstall(this);
        }
      }

      const isPluginEnabled =
        typeof plugin.config === 'undefined' ||
        (plugin.config && typeof plugin.config.enabled === 'undefined') ||
        (plugin.config && plugin.config.enabled === true);
      if (isPluginEnabled) {
        // enabled with config, and boolean enabled property
        this.$plugins.set(name, plugin);

        plugin.install(this);

        if (this.constructor.name === 'App') {
          Log.yellow().verbose(`Installed plugin: ${name} (${this.constructor.name})`);
          Log.debug(`${JSON.stringify(plugin.config || {}, null, '\t')}`);
          Log.debug();
        }
        this.emit('use', plugin);
      }
    }
    return this;
  }

  /**
   * Removes all plugins from extensible object
   * Calls plugin's uninstall() method
   */
  removeAll() {
    this.$plugins.forEach((entry: Plugin) => {
      if (entry && entry.uninstall) {
        entry.uninstall(this);
      }
    });
    this.$plugins.clear();
  }

  /**
   * Removes plugin from plugins
   * @param {string} name
   */
  remove(name: string) {
    const plugin = this.$plugins.get(name);

    if (plugin) {
      if (plugin.uninstall) {
        plugin.uninstall(this);
      }
      this.$plugins.delete(name);
      Log.verbose(`Removed plugin: ${name}`);
    }
  }

  /**
   * Return or initialize middleware
   * @param {string} name
   * @returns {Middleware}
   */
  middleware(name: string): Middleware | undefined {
    if (!this.actionSet.get(name)) {
      return this.actionSet.create(name, this);
    }
    return this.actionSet.get(name);
  }

  /**
   * Check for middleware with given name
   * @param {string} name
   * @return {boolean}
   */
  hasMiddleware(name: string): boolean {
    return typeof this.actionSet.get(name) !== 'undefined';
  }

  /**
   * Install method which is called after use
   * Must be implemented
   * @param extensible
   */
  abstract install(extensible: Extensible): void;

  /**
   *
   * Uninstall method which is called on remove
   *
   * @param extensible
   */
  uninstall?(extensible: Extensible): void;
}

/**
 * @see https://gist.github.com/Yimiprod/7ee176597fef230d1451
 * Deep diff between two object, using lodash
 * @param  {Record<string, any>} aObject Object compared
 * @param  {Record<string, any>} aBase   Object to compare with
 * @return {Record<string, any>>}        Return a new object who represent the diff
 */
// tslint:disable:no-any
function difference(aObject: Record<string, any>, aBase: Record<string, any>): Record<string, any> {
  function changes(object: Record<string, any>, base: Record<string, any>): Record<string, any> {
    return _transform(object, (result: Record<string, any>, value: any, key: string) => {
      if (!_isEqual(value, base[key])) {
        result[key] =
          typeof value === 'object' && typeof base[key] === 'object'
            ? changes(value, base[key])
            : value;
      }
    });
  }

  return changes(aObject, aBase);
}

// tslint:enable:no-any
