import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
import PulseLabsRecorder = require('pulselabs-recorder');

import { InitOptions } from 'pulselabs-recorder/dist/interfaces/init-options.interface'; // tslint:disable-line

export interface Config extends PluginConfig {
  apiKey: string;
  options?: InitOptions;
}

export class PulseLabs implements Plugin {
  config: Config = {
    apiKey: '',
    options: {
      debug: false,
      timeout: 2000,
    },
  };
  pulse: PulseLabsRecorder;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    const initOptions = { ...this.config.options, integrationType: 'Jovo' };
    this.pulse = PulseLabsRecorder.init(this.config.apiKey, initOptions as InitOptions);
  }

  install(app: BaseApp) {
    app.on('after.response', this.logData.bind(this));
  }

  async logData(handleRequest: HandleRequest) {
    await this.pulse.logData(handleRequest.jovo!.$request, handleRequest.jovo!.$response);
  }
}
