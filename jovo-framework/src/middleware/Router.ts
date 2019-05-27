import {BaseApp, Plugin, EnumRequestType, HandleRequest, PluginConfig, Log, SessionConstants} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');
import {App, Config as AppConfig} from "../App";
import { Component } from "./Component";

export interface Config extends PluginConfig {
    intentMap?: { [key: string]: string; };
    intentsToSkipUnhandled?: string[];
}

export interface Route {
    path: string;
    type: string;
    state?: string;
    intent?: string;
    from?: string;
}

export class Router implements Plugin {
    config: Config = {
        intentMap: {},
        intentsToSkipUnhandled: [],
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        app.middleware('router')!.use(this.router.bind(this));
    }
    uninstall(app: BaseApp) {

    }
    async router(handleRequest: HandleRequest) {

        Log.white().verbose(Log.header('Jovo router ', 'framework'));

        if (!handleRequest.jovo) {
            return;
        }

        if (!handleRequest.jovo.$type || !handleRequest.jovo.$type.type) {
            throw new Error(`Couldn't access request type`);
        }

        let route: Route = {
            type: handleRequest.jovo.$type.type,
            path: handleRequest.jovo.$type.type,
        };


        if (handleRequest.jovo.$type.type &&
            handleRequest.jovo.$type.subType) {
            route.path = `${handleRequest.jovo.$type.type}["${handleRequest.jovo.$type.subType}"]`;
        }
        if (route.type === EnumRequestType.INTENT) {
            // do intent stuff
            if (!handleRequest.jovo.$nlu ||
                !handleRequest.jovo.$nlu.intent) {
                throw new Error(`Couldn't get route for intent request.`);
            }

            // parse component to `mapIntentName` only if it's active
            let component: Component | undefined = undefined;
            if (handleRequest.jovo.getSessionAttribute(SessionConstants.COMPONENT)) {
                component = handleRequest.jovo.$components[handleRequest.jovo.getSessionAttribute(SessionConstants.COMPONENT)];
            }

            const intent = Router.mapIntentName(this.config, handleRequest.jovo.$nlu.intent.name, component);
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), intent, (handleRequest.jovo.$app.config as AppConfig).intentsToSkipUnhandled);
        } else if (route.type === EnumRequestType.END) {
            // do end stuff
            if(typeof _get(handleRequest.app.config,`handlers.${EnumRequestType.END}`) === 'function') {
                route.path = EnumRequestType.END;
            }

        } else if (route.type === EnumRequestType.AUDIOPLAYER) {
            route.path = `${EnumRequestType.AUDIOPLAYER}["${handleRequest.jovo.$type.subType}"]`;
        } else if (route.type === EnumRequestType.ON_ELEMENT_SELECTED) {
            // workaround
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), EnumRequestType.ON_ELEMENT_SELECTED, (handleRequest.jovo.$app.config as AppConfig).intentsToSkipUnhandled);
            route.type = EnumRequestType.ON_ELEMENT_SELECTED;

            if (typeof _get(handleRequest.jovo.$handlers, route.path) === 'object') {
                route.path += '.' + handleRequest.jovo.$type.subType;
            }
        }
        _set(handleRequest.jovo.$plugins, 'Router.route', route);


        Log.yellow().verbose('Route object:');
        Log.yellow().verbose(`${JSON.stringify(route, null, '\t')}`);

    }

    static intentRoute(handlers: any,  state: string | undefined, intent: string, intentsToSkipUnhandled?: string[]): Route { // tslint:disable-line
        let _state = state + '';
        const _intent = intent + '';
        let path = state ?
            state + '.' + intent: intent;


        // rewrite path if there is a dot in the intent name
        if (_intent && _intent.indexOf('.') > -1) {
            path = state ? state : '';
            path += '["' + _intent + '"]';
        }
        if (_get(handlers, path)) {
            return {
                path,
                state,
                intent,
                type: EnumRequestType.INTENT,
            };
        }

        if (_state) {
            while (_state !== '') {
                if (_get(handlers, _state + '["' + _intent + '"]')) {
                    path = _state + '["' + _intent + '"]';
                    return {
                        path,
                        state,
                        intent,
                        type: EnumRequestType.INTENT,
                    };
                }

                // State 'unhandled' is available and intent is not in intentsToSkipUnhandled
                if (_get(handlers, _state + '.' + EnumRequestType.UNHANDLED)) {
                    if (!intentsToSkipUnhandled || intentsToSkipUnhandled.indexOf(_intent) === -1) {
                        path = _state + '.' + EnumRequestType.UNHANDLED;
                        return {
                            path,
                            state,
                            intent,
                            type: EnumRequestType.INTENT,
                        };
                    }
                }

                _state = Router.getLastLevel(_state);
            }
            // is intent in global?
            if (_get(handlers, _intent)) {
                return {
                    path: _intent,
                    state,
                    intent,
                    type: EnumRequestType.INTENT,
                };
            }
        }
        const pathToUnhandled = _state ? _state + '.' + EnumRequestType.UNHANDLED : EnumRequestType.UNHANDLED;

        if (_get(handlers, pathToUnhandled)) {
            path = pathToUnhandled;
        }

        return {
            path,
            state,
            intent,
            type: EnumRequestType.INTENT,
        };
    }

    /**
     * Returns last level of path
     * @param {string} route
     * @return {string}
     */
    static getLastLevel(route: string) {
        let level = '';
        if (route.indexOf('.')) {
            level = route.substr(0, route.lastIndexOf('.'));
        }
        return level;
    }

    /**
     * Maps given intent by the platform with a map in the config
     * Uses component's intent map if it's active
     * {
     *     'AMAZON.StopIntent': 'StopIntent',
     * }
     *
     * @param {Config} appConfig
     * @param {string} intentName
     * @param {string} componentName
     * @returns {string}
     */
    static mapIntentName(appConfig: Config, intentName: string, component?: Component): string {
        // use component's intent map if component is in use:
        if (component) {
            const componentIntentMap = component.config.intentMap;
            if (componentIntentMap && componentIntentMap[intentName]) {
                Log.verbose(`Mapping intent from ${intentName} to ${componentIntentMap[intentName]}`);

                return componentIntentMap[intentName];
            }
        }

        // use intent mapping if set
        if (appConfig.intentMap && appConfig.intentMap[intentName]) {
            Log.verbose(`Mapping intent from ${intentName} to ${appConfig.intentMap[intentName]}`);
            return appConfig.intentMap[intentName];
        }
        
        return intentName;
    }

}
