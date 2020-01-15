import { Plugin, PluginConfig, Extensible, Platform, JovoError } from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {}

export class GCloudAsr implements Plugin {
  config: Config = {};

  constructor(config?: Config) {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  install(parent: Extensible) {
    if (!(parent instanceof Platform)) {
      throw new JovoError(`'${this.name}' `)
    }
  }
}
