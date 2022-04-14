import _merge from 'lodash.merge';
import { AnyObject, DeepPartial } from '.';

export abstract class Configurable<CONFIG extends AnyObject = AnyObject> {
  config: CONFIG;
  readonly initConfig?: DeepPartial<CONFIG>;

  constructor(config?: DeepPartial<CONFIG>) {
    this.initConfig = config;
    const defaultConfig = this.getDefaultConfig();
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  mergeConfig(config?: DeepPartial<CONFIG>): void {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  abstract getDefaultConfig(): CONFIG;

  getInitConfig?(): DeepPartial<CONFIG> | Promise<DeepPartial<CONFIG>>;
}
