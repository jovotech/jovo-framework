import { BaseApp } from '../core/BaseApp';
import { HandleRequest } from '../core/HandleRequest';
import { Plugin, PluginConfig } from '../Interfaces';
import { Component } from './Component';
export interface Config extends PluginConfig {
    intentMap?: {
        [key: string]: string;
    };
    intentsToSkipUnhandled?: string[];
}
export interface Route {
    path: string;
    type: string;
    state?: string;
    intent?: string;
    from?: string;
}
export declare class Router implements Plugin {
    static intentRoute(handlers: any, state: string | undefined, intent: string, intentsToSkipUnhandled?: string[]): Route;
    /**
     * Returns last level of path
     * @param {string} route
     * @return {string}
     */
    static getLastLevel(route: string): string;
    /**
     * Maps given intent by the platform with a map in the config
     * Uses component's intent map if it's active
     *
     * @param {Config} routerConfig
     * @param {string} intentName
     * @param {string} component
     * @returns {string}
     */
    static mapIntentName(routerConfig: Config, intentName: string, component?: Component): string;
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    router(handleRequest: HandleRequest): Promise<void>;
}
