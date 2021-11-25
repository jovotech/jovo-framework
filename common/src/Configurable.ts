import _merge from 'lodash.merge';
import { AnyObject, DeepPartial, OmitOptional } from '.';

export type ConfigurableInitConfig<T, K extends keyof OmitOptional<T> = never> = DeepPartial<T> &
  Pick<OmitOptional<T>, K>;

export abstract class Configurable<CONFIG extends AnyObject = AnyObject> {
  readonly config: CONFIG;
  readonly initConfig?: DeepPartial<CONFIG>;

  constructor(config?: ConfigurableInitConfig<CONFIG>) {
    this.initConfig = config;
    const defaultConfig: CONFIG = this.getDefaultConfig();
    this.config = config ? _merge(defaultConfig, config) : defaultConfig;
  }

  get name(): string {
    return this.constructor.name;
  }

  abstract getDefaultConfig(): CONFIG;

  getInitConfig?(): DeepPartial<CONFIG> | Promise<DeepPartial<CONFIG>>;
}
