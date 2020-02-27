import { Google } from 'dashbot';
import * as dashbot from 'dashbot'; // tslint:disable-line
import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  key: string;
}

export class DashbotDialogflow implements Analytics {
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

    if (handleRequest.jovo.constructor.name === 'DialogflowAgent') {
      this.dashbot.logIncoming(handleRequest.host.getRequestObject());
      this.dashbot.logOutgoing(
        handleRequest.host.getRequestObject(),
        handleRequest.jovo.$response!,
      );
    }
  }
}
