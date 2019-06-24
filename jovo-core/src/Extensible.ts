import * as EventEmitter from 'events';
import _cloneDeep = require('lodash.clonedeep');
import _get = require('lodash.get');
import _isEqual = require('lodash.isequal');
import _merge = require('lodash.merge');
import _transform = require('lodash.transform');
import { ActionSet } from './ActionSet';
import { Plugin, PluginConfig } from './Interfaces';
import { Log } from './Log';
import { Middleware } from './Middleware';

export interface ExtensibleConfig extends PluginConfig {
	plugin?: any; // tslint:disable-line
}

/**
 * Allows a class to use plugins
 */
export abstract class Extensible extends EventEmitter.EventEmitter implements Plugin {
	config: ExtensibleConfig = {
		enabled: true,
		plugin: {}
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
		plugins.forEach(plugin => {
			const name = plugin.name || plugin.constructor.name;
			// needed to differentiate the default configuration from the constructor-passed config.
			const tmpConstructorArray: any = {
				// tslint:disable-line
				[plugin.constructor.name]: plugin.constructor
			};

			if (plugin.config) {
				const emptyDefaultPluginObject = new tmpConstructorArray[
					plugin.constructor.name
				]();
				const pluginDefaultConfig = _cloneDeep(emptyDefaultPluginObject.config);

                if (typeof pluginDefaultConfig.enabled === 'undefined') {
                    pluginDefaultConfig.enabled = true;
                }

				if (typeof plugin.config.enabled === 'undefined') {
                    plugin.config.enabled = true;
				}

				const appConfig = _cloneDeep(this.config);

				const constructorConfig = difference(
					plugin.config,
					pluginDefaultConfig
				);

				for (const prop in plugin.config) {

					if (prop in pluginDefaultConfig) {
						let val;
						const appConfigVal = _get(appConfig, `plugin.${name}.${prop}`);
                        if (typeof constructorConfig[prop] !== 'undefined') {
							val = plugin.config[prop];
						} else if (typeof appConfigVal !== 'undefined') {
							val = appConfigVal;
						} else {
							val = pluginDefaultConfig[prop];
						}
						if (typeof val === 'object') {
                        	if(!plugin.config[prop]) { // tslint:disable-line
                                plugin.config[prop] = val;
                            } else {
                                plugin.config[prop] = Object.assign(plugin.config[prop], val); // tslint:disable-line:prefer-object-spread
                            }

                        } else {
                            plugin.config[prop] = val;
                        }
					} else {
						Log.verbose(
							`[${name}] Property '${prop}' passed as config-option for plugin '${name}' but not defined in the default-config. Only properties that exist in the default-configuration can be set!`
						);
					}
				}

				if (this.config.plugin && this.config.plugin[name]) {
					this.config.plugin[name] = plugin.config;
				}
			}

			// remove existing plugin with the same name
			if (this.$plugins.get(name)) {
				const existingPlugin = this.$plugins.get(name);

				if (existingPlugin && existingPlugin.uninstall) {
					existingPlugin.uninstall(this);
				}
			}
			if (
				typeof plugin.config === 'undefined' || // enabled by default, even without config
				(plugin.config && typeof plugin.config.enabled === 'undefined') || // enabled with config, but without enabled property
				(plugin.config &&
					typeof plugin.config.enabled === 'boolean' &&
					plugin.config.enabled)
			) {
				// enabled with config, and boolean enabled property
				this.$plugins.set(name, plugin);

				plugin.install(this);

				if (this.constructor.name === 'App') {
					Log.yellow().verbose(
						`Installed plugin: ${name} (${this.constructor.name})`
					);
					Log.debug(`${JSON.stringify(plugin.config || {}, null, '\t')}`);
					Log.debug();
				}
				this.emit('use', plugin);
			}
		});
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
 * @param  {any} object Object compared
 * @param  {any} base   Object to compare with
 * @return {any}        Return a new object who represent the diff
 */
// tslint:disable-next-line
function difference(object: any, base: any) {
	// tslint:disable-next-line
	function changes(object: any, base: { [key: string]: any }) {
		// tslint:disable-next-line
		return _transform(
			object,
			(result: { [key: string]: any }, value: any, key: string) => {
				if (!_isEqual(value, base[key])) {
					result[key] =
						typeof value === 'object' && typeof base[key] === 'object'
							? changes(value, base[key])
							: value;
				}
			}
		);
	}

	return changes(object, base);
}
