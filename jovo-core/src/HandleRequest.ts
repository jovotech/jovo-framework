import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import { App, AppConfig } from './App';
import { Extensible } from './Extensible';
import { DeepPartial } from './index';

export class HandleRequest extends Extensible<AppConfig> {
  readonly middlewareCollection!: App['middlewareCollection'];

  constructor(app: App) {
    super(_cloneDeep(app.config) as DeepPartial<AppConfig>);
    _merge(this, _cloneDeep(app));
  }

  getDefaultConfig(): AppConfig {
    return {
      test: '',
    };
  }

  mount(): Promise<void> {
    return this.mountPlugins();
  }
}
