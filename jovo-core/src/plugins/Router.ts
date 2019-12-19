import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import { BaseApp } from '../core/BaseApp';
import { HandleRequest } from '../core/HandleRequest';
import { EnumRequestType, SessionConstants } from '../enums';
import { Plugin, PluginConfig } from '../Interfaces';
import { Log } from '../util/Log';
import { Component, ComponentSessionData } from './Component';

// import { App, Config as AppConfig } from '../App';

export interface Config extends PluginConfig {
  intentMap?: { [key: string]: string };
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
  static intentRoute(
    handlers: any,
    state: string | undefined,
    intent: string,
    intentsToSkipUnhandled?: string[],
  ): Route {
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
        type: EnumRequestType.INTENT,
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
            type: EnumRequestType.INTENT,
          };
        }

        // State 'unhandled' is available and intent is not in intentsToSkipUnhandled
        if (_get(handlers, _state + '.' + EnumRequestType.UNHANDLED)) {
          if (!intentsToSkipUnhandled || intentsToSkipUnhandled.indexOf(_intent) === -1) {
            path = _state + '.' + EnumRequestType.UNHANDLED;
            return {
              intent,
              path,
              state,
              type: EnumRequestType.INTENT,
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
          type: EnumRequestType.INTENT,
        };
      }
    }
    const pathToUnhandled = _state
      ? _state + '.' + EnumRequestType.UNHANDLED
      : EnumRequestType.UNHANDLED;

    if (_get(handlers, pathToUnhandled)) {
      path = pathToUnhandled;
    }

    return {
      intent,
      path,
      state,
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
   *
   * @param {Config} routerConfig
   * @param {string} intentName
   * @param {string} component
   * @returns {string}
   */
  static mapIntentName(routerConfig: Config, intentName: string, component?: Component): string {
    // use component's intent map if component is in use:
    if (component) {
      const componentIntentMap = component.config.intentMap;
      if (componentIntentMap && componentIntentMap[intentName]) {
        Log.verbose(`Mapping intent from ${intentName} to ${componentIntentMap[intentName]}`);

        return componentIntentMap[intentName];
      }
    }

    // use intent mapping if set
    if (routerConfig.intentMap && routerConfig.intentMap[intentName]) {
      Log.verbose(`Mapping intent from ${intentName} to ${routerConfig.intentMap[intentName]}`);
      return routerConfig.intentMap[intentName];
    }

    return intentName;
  }

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
  async router(handleRequest: HandleRequest) {
    Log.white().verbose(Log.header('Jovo router ', 'framework'));

    if (!handleRequest.jovo) {
      return;
    }

    if (!handleRequest.jovo.$type || !handleRequest.jovo.$type.type) {
      throw new Error(`Couldn't access request type`);
    }

    let route: Route = {
      path: handleRequest.jovo.$type.type,
      type: handleRequest.jovo.$type.type,
    };

    if (handleRequest.jovo.$type.type && handleRequest.jovo.$type.subType) {
      route.path = `${handleRequest.jovo.$type.type}["${handleRequest.jovo.$type.subType}"]`;
    }
    if (route.type === EnumRequestType.INTENT) {
      // do intent stuff
      if (!handleRequest.jovo.$nlu || !handleRequest.jovo.$nlu.intent) {
        throw new Error(`Couldn't get route for intent request.`);
      }

      // parse component to `mapIntentName` only if it's active
      let activeComponent: Component | undefined;
      const componentSessionStack: Array<[string, ComponentSessionData]> =
        handleRequest.jovo.$session.$data[SessionConstants.COMPONENT];

      if (componentSessionStack && componentSessionStack.length > 0) {
        const latestComponentFromSessionStack: [string, ComponentSessionData] =
          componentSessionStack[componentSessionStack.length - 1];
        activeComponent = handleRequest.jovo.$components[latestComponentFromSessionStack[0]];
      }

      const intent = Router.mapIntentName(
        handleRequest.jovo.$config.plugin!.Router!,
        handleRequest.jovo.$nlu.intent.name,
        activeComponent,
      );

      route = Router.intentRoute(
        handleRequest.jovo.$handlers,
        handleRequest.jovo.getState(),
        intent,
        handleRequest.jovo.$app.config.intentsToSkipUnhandled,
      );
    } else if (route.type === EnumRequestType.END) {
      route = Router.intentRoute(
        handleRequest.jovo.$handlers,
        handleRequest.jovo.getState(),
        EnumRequestType.END,
        handleRequest.jovo.$app.config.intentsToSkipUnhandled,
      );
      route.type = EnumRequestType.END;
    } else if (route.type === EnumRequestType.AUDIOPLAYER) {
      route.path = `${EnumRequestType.AUDIOPLAYER}["${handleRequest.jovo.$type.subType}"]`;
    } else if (route.type === EnumRequestType.ON_ELEMENT_SELECTED) {
      // workaround
      route = Router.intentRoute(
        handleRequest.jovo.$handlers,
        handleRequest.jovo.getState(),
        EnumRequestType.ON_ELEMENT_SELECTED,
        handleRequest.jovo.$app.config.intentsToSkipUnhandled,
      );
      route.type = EnumRequestType.ON_ELEMENT_SELECTED;

      if (typeof _get(handleRequest.jovo.$handlers, route.path) === 'object') {
        route.path += '.' + handleRequest.jovo.$type.subType;
      }
    }

    _set(handleRequest.jovo.$plugins, 'Router.route', route);

    Log.yellow().verbose('Route object:');
    Log.yellow().verbose(`${JSON.stringify(route, null, '\t')}`);
  }
}
