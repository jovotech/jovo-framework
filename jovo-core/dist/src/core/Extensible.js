"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const _cloneDeep = require("lodash.clonedeep");
const _isEqual = require("lodash.isequal");
const _merge = require("lodash.merge");
const _transform = require("lodash.transform");
const Log_1 = require("./../util/Log");
const ActionSet_1 = require("./ActionSet");
/**
 * Allows a class to use plugins
 */
class Extensible extends EventEmitter.EventEmitter {
    constructor(config) {
        super();
        this.config = {
            enabled: true,
            plugin: {},
        };
        this.$plugins = new Map();
        this.setMaxListeners(0);
        // TODO: statement below could be deleted: the values set here are overridden by the config property in the extending classes
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new ActionSet_1.ActionSet([], this);
    }
    /**
     * Adds plugin to base class
     * @param {Plugin} plugins
     * @returns {this}
     */
    use(...plugins) {
        for (const plugin of plugins) {
            const name = plugin.name || plugin.constructor.name;
            if (plugin.config) {
                const constructor = plugin.constructor;
                const emptyPluginObject = new constructor();
                const defaultConfig = _cloneDeep(emptyPluginObject.config);
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
            const isPluginEnabled = typeof plugin.config === 'undefined' ||
                (plugin.config && typeof plugin.config.enabled === 'undefined') ||
                (plugin.config && plugin.config.enabled === true);
            if (isPluginEnabled) {
                // enabled with config, and boolean enabled property
                this.$plugins.set(name, plugin);
                plugin.install(this);
                if (this.constructor.name === 'App') {
                    Log_1.Log.yellow().verbose(`Installed plugin: ${name} (${this.constructor.name})`);
                    Log_1.Log.debug(`${JSON.stringify(plugin.config || {}, null, '\t')}`);
                    Log_1.Log.debug();
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
        this.$plugins.forEach((entry) => {
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
    remove(name) {
        const plugin = this.$plugins.get(name);
        if (plugin) {
            if (plugin.uninstall) {
                plugin.uninstall(this);
            }
            this.$plugins.delete(name);
            Log_1.Log.verbose(`Removed plugin: ${name}`);
        }
    }
    /**
     * Return or initialize middleware
     * @param {string} name
     * @returns {Middleware}
     */
    middleware(name) {
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
    hasMiddleware(name) {
        return typeof this.actionSet.get(name) !== 'undefined';
    }
}
exports.Extensible = Extensible;
/**
 * @see https://gist.github.com/Yimiprod/7ee176597fef230d1451
 * Deep diff between two object, using lodash
 * @param  {Record<string, any>} aObject Object compared
 * @param  {Record<string, any>} aBase   Object to compare with
 * @return {Record<string, any>>}        Return a new object who represent the diff
 */
// tslint:disable:no-any
function difference(aObject, aBase) {
    function changes(object, base) {
        return _transform(object, (result, value, key) => {
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
//# sourceMappingURL=Extensible.js.map