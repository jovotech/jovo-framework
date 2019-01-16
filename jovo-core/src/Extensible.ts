import * as EventEmitter from "events";
import {Plugin, PluginConfig} from "./Interfaces";
import {ActionSet} from "./ActionSet";
import {Middleware} from "./Middleware";
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _isEqual = require('lodash.isequal');
import _cloneDeep = require('lodash.clonedeep');
import _transform = require('lodash.transform');
import {Log} from "./Log";


export interface ExtensibleConfig extends PluginConfig {
    plugin?: any; // tslint:disable-line
}

/**
 * Allows a class to use plugins
 */
export abstract class Extensible extends EventEmitter implements Plugin {
    config: ExtensibleConfig = {
        enabled: true,
        plugin: {},
    };
    $plugins: Map<string, Plugin> = new Map();
    actionSet: ActionSet;

    constructor(config?: ExtensibleConfig) {
        super();
        this.setMaxListeners(0);
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
        plugins.forEach((plugin) => {
            const name = plugin.name || plugin.constructor.name;
            // needed to instantiate the object from a string
            const tmpConstructorArray: any = { // tslint:disable-line
                [plugin.constructor.name]: plugin.constructor
            };

            if (plugin.config) {

                const emptyDefaultPluginObject = new tmpConstructorArray[plugin.constructor.name]();
                const pluginDefaultConfig = _cloneDeep(emptyDefaultPluginObject.config);
                const appConfig = _cloneDeep(this.config);

                const pluginAppConfig: any = {}; // tslint:disable-line

                Object.keys(pluginDefaultConfig).forEach((item: string) => {
                    pluginAppConfig[item] = _get(appConfig, `plugin.${name}.${item}`);
                });

                const pluginConstructorConfig: any = {}; // tslint:disable-line
                const constructorConfig = difference(plugin.config, pluginDefaultConfig);

                Object.keys(pluginDefaultConfig).forEach((item: string) => {
                    pluginConstructorConfig[item] = _get(constructorConfig, `${item}`);
                });

                plugin.config = _merge(pluginDefaultConfig, pluginAppConfig, constructorConfig );
                if (this.config.plugin && this.config.plugin[name]) {
                    this.config.plugin[name] = plugin.config;
                }
            }

            // remove existing plugin with the same name
            if (this.$plugins.get(name)) {
                this.$plugins.get(name)!.uninstall(this);
            }

            this.$plugins.set(name, plugin);

            plugin.install(this);

            if (this.constructor.name === 'App') {
                Log.yellow().verbose(`Installed plugin: ${name} (${this.constructor.name})`);
                Log.debug(`   ${JSON.stringify(plugin.config || {}, null, '\t')}`);
                Log.debug();
            }
            this.emit('use', plugin);
        });
        return this;
    }

    /**
     * Removes all plugins from extensible object
     * Calls plugin's uninstall() method
     */
    removeAll() {
        this.$plugins.forEach((entry: Plugin) => {
            entry.uninstall(this);
        });
        this.$plugins.clear();
    }

    /**
     * Removes plugin from plugins
     * @param {string} name
     */
    remove(name: string) {
        if (this.$plugins.get(name)) {
            this.$plugins.get(name)!.uninstall(this);
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

    abstract install(extensible: Extensible): void;
    abstract uninstall(extensible: Extensible): void;
}
/**
 * @see https://gist.github.com/Yimiprod/7ee176597fef230d1451
 * Deep diff between two object, using lodash
 * @param  {any} object Object compared
 * @param  {any} base   Object to compare with
 * @return {any}        Return a new object who represent the diff
 */
// tslint:disable-next-line
function difference(object: any, base: any) {
    // tslint:disable-next-line
    function changes(object: any, base: any) {
        // tslint:disable-next-line
        return _transform(object, (result: any, value: any, key: any) => {
            if (!_isEqual(value, base[key])) {
                result[key] = (typeof value === 'object' && typeof base[key] === 'object') ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}
