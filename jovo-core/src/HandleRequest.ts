import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import { App, AppConfig } from './App';
import { Extensible } from './Extensible';
import { Host } from './Host';
import { DeepPartial, RegisteredComponents } from './index';

export class HandleRequest extends Extensible<AppConfig> {
  readonly middlewareCollection!: App['middlewareCollection'];
  readonly components!: RegisteredComponents;

  // TODO: remove request, test only
  constructor(readonly app: App, readonly request: Record<string, any>, readonly host: Host) {
    super(_cloneDeep(app.config) as DeepPartial<AppConfig>);
    _merge(this, _cloneDeep(app));
  }

  getDefaultConfig(): AppConfig {
    return {
      placeholder: '',
    };
  }

  mount(): Promise<void> {
    return this.mountPlugins();
  }
}
