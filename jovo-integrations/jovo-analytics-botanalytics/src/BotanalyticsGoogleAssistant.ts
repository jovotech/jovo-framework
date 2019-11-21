import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');

import { GoogleAssistant } from 'botanalytics';

export interface Config extends PluginConfig {
  key: string;
}

export class BotanalyticsGoogleAssistant implements Analytics {
  config: Config = {
    key: '',
  };
  botanalytics!: GoogleAssistant;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.track = this.track.bind(this);
  }

  install(app: BaseApp) {
    this.botanalytics = GoogleAssistant(this.config.key);
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
      this.botanalytics.log(handleRequest.jovo.$request!.toJSON(), handleRequest.jovo.$response!);
    }
  }
}
