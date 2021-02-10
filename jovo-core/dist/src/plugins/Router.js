"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const enums_1 = require("../enums");
const Log_1 = require("../util/Log");
class Router {
    constructor(config) {
        this.config = {
            intentMap: {},
            intentsToSkipUnhandled: [],
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    static intentRoute(handlers, state, intent, intentsToSkipUnhandled) {
        let _state = state + ''; // tslint:disable-line:variable-name
        const _intent = intent + ''; // tslint:disable-line:variable-name
        let path = state ? state + '.' + intent : intent;
        // rewrite path if there is a dot in the intent name
        if (_intent && _intent.indexOf('.') > -1) {
            path = state ? state : '';
            path += '["' + _intent + '"]';
        }
        if (_get(handlers, path)) {
            return {
                intent,
                path,
                state,
                type: enums_1.EnumRequestType.INTENT,
            };
        }
        if (_state) {
            while (_state !== '') {
                if (_get(handlers, _state + '["' + _intent + '"]')) {
                    path = _state + '["' + _intent + '"]';
                    return {
                        intent,
                        path,
                        state,
                        type: enums_1.EnumRequestType.INTENT,
                    };
                }
                // State 'unhandled' is available and intent is not in intentsToSkipUnhandled
                if (_get(handlers, _state + '.' + enums_1.EnumRequestType.UNHANDLED)) {
                    if (!intentsToSkipUnhandled || intentsToSkipUnhandled.indexOf(_intent) === -1) {
                        path = _state + '.' + enums_1.EnumRequestType.UNHANDLED;
                        return {
                            intent,
                            path,
                            state,
                            type: enums_1.EnumRequestType.INTENT,
                        };
                    }
                }
                _state = Router.getLastLevel(_state);
            }
            // is intent in global?
            if (_get(handlers, _intent)) {
                return {
                    intent,
                    path: _intent,
                    state,
                    type: enums_1.EnumRequestType.INTENT,
                };
            }
        }
        const pathToUnhandled = _state
            ? _state + '.' + enums_1.EnumRequestType.UNHANDLED
            : enums_1.EnumRequestType.UNHANDLED;
        if (_get(handlers, pathToUnhandled)) {
            path = pathToUnhandled;
        }
        return {
            intent,
            path,
            state,
            type: enums_1.EnumRequestType.INTENT,
        };
    }
    /**
     * Returns last level of path
     * @param {string} route
     * @return {string}
     */
    static getLastLevel(route) {
        let level = '';
        if (route.indexOf('.')) {
            level = route.substr(0, route.lastIndexOf('.'));
        }
        return level;
    }
    /**
     * Maps given intent by the platform with a map in the config
     * Uses component's intent map if it's active
     *
     * @param {Config} routerConfig
     * @param {string} intentName
     * @param {string} component
     * @returns {string}
     */
    static mapIntentName(routerConfig, intentName, component) {
        // use component's intent map if component is in use:
        if (component) {
            const componentIntentMap = component.config.intentMap;
            if (componentIntentMap && componentIntentMap[intentName]) {
                Log_1.Log.verbose(`Mapping intent from ${intentName} to ${componentIntentMap[intentName]}`);
                return componentIntentMap[intentName];
            }
        }
        // use intent mapping if set
        if (routerConfig.intentMap && routerConfig.intentMap[intentName]) {
            Log_1.Log.verbose(`Mapping intent from ${intentName} to ${routerConfig.intentMap[intentName]}`);
            return routerConfig.intentMap[intentName];
        }
        return intentName;
    }
    install(app) {
        app.middleware('router').use(this.router.bind(this));
    }
    async router(handleRequest) {
        Log_1.Log.white().verbose(Log_1.Log.header('Jovo router ', 'framework'));
        if (!handleRequest.jovo) {
            return;
        }
        if (!handleRequest.jovo.$type || !handleRequest.jovo.$type.type) {
            throw new Error(`Couldn't access request type`);
        }
        let route = {
            path: handleRequest.jovo.$type.type,
            type: handleRequest.jovo.$type.type,
        };
        if (handleRequest.jovo.$type.type && handleRequest.jovo.$type.subType) {
            route.path = `${handleRequest.jovo.$type.type}["${handleRequest.jovo.$type.subType}"]`;
        }
        if ((route.type === enums_1.EnumRequestType.INTENT || route.type === enums_1.EnumRequestType.ON_TEXT) &&
            handleRequest.jovo.$nlu &&
            handleRequest.jovo.$nlu.intent) {
            // parse component to `mapIntentName` only if it's active
            let activeComponent;
            const componentSessionStack = handleRequest.jovo.$session.$data[enums_1.SessionConstants.COMPONENT];
            if (componentSessionStack && componentSessionStack.length > 0) {
                const latestComponentFromSessionStack = componentSessionStack[componentSessionStack.length - 1];
                activeComponent = handleRequest.jovo.$components[latestComponentFromSessionStack[0]];
            }
            const intent = Router.mapIntentName(handleRequest.jovo.$config.plugin.Router, handleRequest.jovo.$nlu.intent.name, activeComponent);
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), intent, handleRequest.jovo.$app.config.intentsToSkipUnhandled);
        }
        else if ((route.type === enums_1.EnumRequestType.INTENT || route.type === enums_1.EnumRequestType.ON_TEXT) &&
            (!handleRequest.jovo.$nlu || !handleRequest.jovo.$nlu.intent)) {
            route.type = enums_1.EnumRequestType.ON_TEXT;
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), enums_1.EnumRequestType.ON_TEXT, handleRequest.jovo.$app.config.intentsToSkipUnhandled);
            route.type = enums_1.EnumRequestType.ON_TEXT;
        }
        else if (route.type === enums_1.EnumRequestType.END) {
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), enums_1.EnumRequestType.END, handleRequest.jovo.$app.config.intentsToSkipUnhandled);
            route.type = enums_1.EnumRequestType.END;
        }
        else if (route.type === enums_1.EnumRequestType.AUDIOPLAYER) {
            route.path = `${enums_1.EnumRequestType.AUDIOPLAYER}["${handleRequest.jovo.$type.subType}"]`;
        }
        else if (route.type === enums_1.EnumRequestType.ON_ELEMENT_SELECTED) {
            // workaround
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), enums_1.EnumRequestType.ON_ELEMENT_SELECTED, handleRequest.jovo.$app.config.intentsToSkipUnhandled);
            route.type = enums_1.EnumRequestType.ON_ELEMENT_SELECTED;
            if (typeof _get(handleRequest.jovo.$handlers, route.path) === 'object') {
                route.path += '.' + handleRequest.jovo.$type.subType;
            }
        }
        else if (route.type === enums_1.EnumRequestType.ON_DTMF) {
            route = Router.intentRoute(handleRequest.jovo.$handlers, handleRequest.jovo.getState(), enums_1.EnumRequestType.ON_DTMF, handleRequest.jovo.$app.config.intentsToSkipUnhandled);
            route.type = enums_1.EnumRequestType.ON_DTMF;
        }
        _set(handleRequest.jovo.$plugins, 'Router.route', route);
        Log_1.Log.yellow().verbose('Route object:');
        Log_1.Log.yellow().verbose(`${JSON.stringify(route, null, '\t')}`);
    }
}
exports.Router = Router;
//# sourceMappingURL=Router.js.map