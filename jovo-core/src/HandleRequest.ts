import _cloneDeep from 'lodash.clonedeep';
import { App, AppConfig } from './App';
import { Extensible } from './Extensible';
import { DeepPartial } from './index';
import { MiddlewareCollection } from './MiddlewareCollection';

export class HandleRequest extends Extensible<AppConfig> {
  readonly middlewareCollection: MiddlewareCollection;

  constructor({ config, middlewareCollection, plugins }: App) {
    super(_cloneDeep(config) as DeepPartial<AppConfig>);
    this.middlewareCollection = middlewareCollection.clone();
    for (const key in plugins) {
      if (plugins.hasOwnProperty(key)) {
        this.plugins[key] = plugins[key];
      }
    }
  }

  getDefaultConfig(): AppConfig {
    return {
      test: '',
    };
  }

  mount(): Promise<void> | void {
    return;
  }
}
