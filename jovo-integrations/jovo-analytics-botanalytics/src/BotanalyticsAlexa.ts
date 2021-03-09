import { Analytics, BaseApp, HandleRequest, Log, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');

import { AmazonAlexa } from 'botanalytics';

export interface Config extends PluginConfig {
  key: string;
}

export class BotanalyticsAlexa implements Analytics {
  config: Config = {
    key: '',
  };
  botanalytics!: AmazonAlexa;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.track = this.track.bind(this);
  }

  install(app: BaseApp) {
    this.botanalytics = AmazonAlexa(this.config.key);
    app.on('response', this.track);
  }

  uninstall(app: BaseApp) {
    app.removeListener('response', this.track);
  }

  track(handleRequest: HandleRequest) {
    if (!handleRequest.jovo) {
      return;
    }

    if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
      try {
        this.botanalytics.log(handleRequest.jovo.$request!.toJSON(), handleRequest.jovo.$response!);
      } catch (e) {
        Log.error('Error while logging to Botanalytics');
        Log.error(e);
      }
    }
  }
}
