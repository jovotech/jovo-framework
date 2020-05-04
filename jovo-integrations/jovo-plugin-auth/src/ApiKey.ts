import { Extensible, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  'x-api-key'?: string;
  'customKeyName'?: string;
  'customKeyValue'?: string;
}

export class ApiKey implements Plugin {
  config: Config = {};

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(parent: Extensible) {
    parent.middleware('before.request')!.use(this.beforerequest.bind(this));
  }

  async beforerequest(handleRequest: HandleRequest) {
    const key = this.config.customKeyName || 'x-api-key';
    const value = this.config.customKeyValue || this.config['x-api-key'];

    if (this.config[key]) {
      if (!handleRequest.host.headers[key] && !handleRequest.host.getQueryParams()[key]) {
        throw new Error('Not authorized.');
      }
      if (handleRequest.host.headers[key] && handleRequest.host.headers[key] !== value) {
        throw new Error('Not authorized.');
      }
      if (
        handleRequest.host.getQueryParams()[key] &&
        handleRequest.host.getQueryParams()[key] !== value
      ) {
        throw new Error('Not authorized.');
      }
    }
  }
}
