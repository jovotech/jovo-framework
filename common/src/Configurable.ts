import _mergeWith from 'lodash.mergewith';
import { AnyObject, DeepPartial } from '.';

export abstract class Configurable<CONFIG extends AnyObject = AnyObject> {
  config: CONFIG;
  readonly initConfig?: DeepPartial<CONFIG>;

  constructor(config?: DeepPartial<CONFIG>) {
    this.initConfig = config;
    const defaultConfig = this.getDefaultConfig();

    this.config = config
      ? _mergeWith(defaultConfig, config, (objValue, srcValue) => {
          if (Array.isArray(objValue)) {
            return srcValue;
          }
        })
      : defaultConfig;
  }

  mergeConfig(config?: DeepPartial<CONFIG>): void {
    this.config = _mergeWith(this.config, config, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    });
  }

  get name(): string {
    return this.constructor.name;
  }

  abstract getDefaultConfig(): CONFIG;

  getInitConfig?(): DeepPartial<CONFIG> | Promise<DeepPartial<CONFIG>>;
}
