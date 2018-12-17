import {BaseApp, Plugin, EnumRequestType, HandleRequest, PluginConfig} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');
import {App, Config as AppConfig} from "../App";
export interface Config extends PluginConfig {
    intentMap?: { [key: string]: string; };
    intentsToSkipUnhandled?: string[];
}

export interface Route {
    path: string;
    type: string;
    intent?: string;
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
        if (!handleRequest.jovo) {
            throw new Error(`Couldn't access jovo object`);
        }

        if (!handleRequest.jovo.$type || !handleRequest.jovo.$type.type) {
            throw new Error(`Couldn't access request type`);
        }

        let route: Route = {
            type: handleRequest.jovo.$type.type,
            path: handleRequest.jovo.$type.type,
        };
        if (handleRequest.jovo.$type.type && handleRequest.jovo.$type.subType) {
            route.path = `${handleRequest.jovo.$type.type}["${handleRequest.jovo.$type.subType}"]`;
        }
        if (route.type === EnumRequestType.INTENT) {
            // do intent stuff
            if (!handleRequest.jovo.$nlu || !handleRequest.jovo.$nlu.intent) {
                throw new Error(`Couldn't get route for intent request.`);
            }

            const intent = Router.mapIntentName(handleRequest.app.config.plugin.Router, handleRequest.jovo.$nlu.intent.name);
            route = Router.intentRoute(handleRequest.app.config, handleRequest.jovo.getState(), intent);
        } else if (route.type === EnumRequestType.END) {
            // do end stuff
        } else if (route.type === EnumRequestType.ON_ELEMENT_SELECTED) {
            if(typeof _get(handleRequest.app.config,`handlers.${EnumRequestType.ON_ELEMENT_SELECTED}`) === 'function') {
                route.path = EnumRequestType.ON_ELEMENT_SELECTED;
            }
        } else if (route.type === EnumRequestType.AUDIOPLAYER) {
            route.path = `${EnumRequestType.AUDIOPLAYER}["${handleRequest.jovo.$type.subType}"]`;
        } else if (route.type === EnumRequestType.ON_ELEMENT_SELECTED) {
            // workaround
            route = Router.intentRoute(handleRequest.app.config, handleRequest.jovo.getState(), EnumRequestType.ON_ELEMENT_SELECTED);
            route.type = EnumRequestType.ON_ELEMENT_SELECTED;

            if (typeof _get((handleRequest.app as App).config.handlers, route.path) === 'object') {
                route.path += '.' + handleRequest.jovo.$type.subType;
            }
        }
        _set(handleRequest.jovo.$plugins, 'Router.route', route);

    }

    static intentRoute(appConfig: AppConfig, state: string | undefined, intent: string) {
        let _state = state + '';
        const _intent = intent + '';
        let path = state ?
            state + '.' + intent: intent;


        // rewrite path if there is a dot in the intent name
        if (_intent && _intent.indexOf('.') > -1) {
            path = state ? state : '';
            path += '["' + _intent + '"]';
        }
        if (_get(appConfig.handlers, path)) {
            return {
                path,
                state,
                intent,
                type: EnumRequestType.INTENT,
            };
        }

        if (_state) {
            while (_state !== '') {
                // State 'unhandled' is available and intent is not in intentsToSkipUnhandled
                if (_get(appConfig.handlers, _state + '.' + EnumRequestType.UNHANDLED)) {
                    if (appConfig.intentsToSkipUnhandled && appConfig.intentsToSkipUnhandled.indexOf(_intent) === -1) {
                        path = _state + '.' + EnumRequestType.UNHANDLED;
                        return {
                        path,
                        state,
                        intent,
                        type: EnumRequestType.INTENT,
                    };
                }

                }
                if (_get(appConfig.handlers, _state + '["' + _intent + '"]')) {
                    path = _state + '["' + _intent + '"]';
                    return {
                        path,
                        state,
                        intent,
                        type: EnumRequestType.INTENT,
                    };
                }
                _state = Router.getLastLevel(_state);
            }
            // is intent in global?
            if (_get(appConfig.handlers, _intent)) {
                return {
                    path: _intent,
                    state,
                    intent,
                    type: EnumRequestType.INTENT,
                };
            }
        }
        const pathToUnhandled = _state ? _state + '.' + EnumRequestType.UNHANDLED : EnumRequestType.UNHANDLED;

        if (_get(appConfig.handlers, pathToUnhandled)) {
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

    static mapIntentName(appConfig: AppConfig, intentName: string): string {
        // use intent mapping if set

        if (appConfig.intentMap && appConfig.intentMap[intentName]) {
            return appConfig.intentMap[intentName];
        }
        return intentName;
    }

}
