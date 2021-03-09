import { Google } from 'dashbot';
import * as dashbot from 'dashbot'; // tslint:disable-line
import { Analytics, BaseApp, HandleRequest, Log, PluginConfig } from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');

export interface Config extends PluginConfig {
  key: string;
}

export class DashbotGoogleAssistant implements Analytics {
  config: Config = {
    key: '',
  };
  dashbot!: Google;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.track = this.track.bind(this);
  }

  install(app: BaseApp) {
    // @ts-ignore
    this.dashbot = dashbot(this.config.key).google;
    app.on('response', this.track);
  }

  uninstall(app: BaseApp) {
    app.removeListener('response', this.track);
  }

  track(handleRequest: HandleRequest) {
    if (!handleRequest.jovo) {
      return;
    }

    if (handleRequest.jovo.constructor.name === 'GoogleAction') {
      try {
        this.dashbot.logIncoming(handleRequest.host.getRequestObject());
      } catch (e) {
        Log.error('Error while logging to Dashbot');
        Log.error(e);
      }

      const responseObj = { ...handleRequest.jovo.$response };

      // @ts-ignore
      let userStorage: Record<string, any> = {};

      try {
        userStorage = JSON.parse(_get(responseObj, 'payload.google.userStorage', {}));
        userStorage.dashbotUser = {
          userId: handleRequest.jovo.$user.getId(),
        };
        _set(responseObj, 'payload.google.userStorage', JSON.stringify(userStorage, null, ''));
      } catch (e) {
        Log.error(e);
      }

      try {
        this.dashbot.logOutgoing(handleRequest.host.getRequestObject(), responseObj);
      } catch (e) {
        Log.error('Error while logging to Dashbot');
        Log.error(e);
      }
    }
  }
}
