import * as EventEmitter from "events";
import * as _ from "lodash";
import {Plugin, PluginConfig} from "./Interfaces";
import {ActionSet} from "./ActionSet";
import {Middleware} from "./Middleware";

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
    plugins: Map<string, Plugin> = new Map();
    actionSet: ActionSet;

    constructor(config?: ExtensibleConfig) {
        super();
        if (config) {
            this.config = _.merge(this.config, config);
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
                const pluginDefaultConfig = JSON.parse(JSON.stringify(emptyDefaultPluginObject.config));
                const appConfig = JSON.parse(JSON.stringify(this.config));
                const pluginAppConfig: any = {}; // tslint:disable-line

                Object.keys(pluginDefaultConfig).forEach((item: string) => {
                    pluginAppConfig[item] = _.get(appConfig, `plugin.${name}.${item}`);
                });

                const pluginConstructorConfig: any = {}; // tslint:disable-line

                const constructorConfig = difference(plugin.config, pluginDefaultConfig);
                Object.keys(pluginDefaultConfig).forEach((item: string) => {
                    pluginConstructorConfig[item] = _.get(constructorConfig, `${item}`);
                });
                plugin.config = _.merge(pluginDefaultConfig, pluginAppConfig, constructorConfig );

            }

            // remove existing plugin with the same name
            if (this.plugins.get(name)) {
                this.plugins.get(name)!.uninstall(this);
            }

            this.plugins.set(name, plugin);
            // this.config.plugin[name] = plugin.config;
            plugin.install(this);
        });
        return this;
    }

    /**
     * Removes plugin from plugins
     * @param {string} name
     */
    remove(name: string) {
        if (this.plugins.get(name)) {
            this.plugins.get(name)!.uninstall(this);
            this.plugins.delete(name);
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
        return _.transform(object, (result: any, value: any, key: any) => {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}
