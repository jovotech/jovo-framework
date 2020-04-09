import { Extensible, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  bearer: string;
}

export class Bearer implements Plugin {
  config: Config = {
    bearer: '',
  };

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(parent: Extensible) {
    parent.middleware('before.request')!.use(this.beforerequest.bind(this));
  }

  async beforerequest(handleRequest: HandleRequest) {
    const token =
      handleRequest.host.headers['Authorization'] ||
      handleRequest.host.headers['authorization'] ||
      '';

    const headerValue = `Bearer ${this.config.bearer}`;
    if (headerValue !== token) {
      throw new Error('Not authorized.');
    }
  }
}
