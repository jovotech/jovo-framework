/// <reference types="node" />
import * as EventEmitter from 'events';
import { ExtensiblePluginConfigs, Plugin, PluginConfig } from './../Interfaces';
import { ActionSet } from './ActionSet';
import { Middleware } from './Middleware';
export interface ExtensibleConfig extends PluginConfig {
    plugin?: ExtensiblePluginConfigs;
}
/**
 * Allows a class to use plugins
 */
export declare abstract class Extensible extends EventEmitter.EventEmitter implements Plugin {
    config: ExtensibleConfig;
    $plugins: Map<string, Plugin>;
    actionSet: ActionSet;
    constructor(config?: ExtensibleConfig);
    /**
     * Adds plugin to base class
     * @param {Plugin} plugins
     * @returns {this}
     */
    use(...plugins: Plugin[]): this;
    /**
     * Removes all plugins from extensible object
     * Calls plugin's uninstall() method
     */
    removeAll(): void;
    /**
     * Removes plugin from plugins
     * @param {string} name
     */
    remove(name: string): void;
    /**
     * Return or initialize middleware
     * @param {string} name
     * @returns {Middleware}
     */
    middleware(name: string): Middleware | undefined;
    /**
     * Check for middleware with given name
     * @param {string} name
     * @return {boolean}
     */
    hasMiddleware(name: string): boolean;
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
