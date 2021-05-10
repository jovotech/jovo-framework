import cloneDeep from 'clone-deep';
import _merge from 'lodash.merge';
import { App, AppBaseMiddlewares, AppConfig } from './App';
import { Extensible } from './Extensible';
import { Server } from './Server';
import { DeepPartial, MiddlewareCollection, Platform, RegisteredComponents } from './index';

export class HandleRequest extends Extensible<AppConfig, AppBaseMiddlewares> {
  readonly components: RegisteredComponents;
  $platform!: Platform;

  constructor(readonly app: App, readonly server: Server) {
    super(cloneDeep(app.config) as DeepPartial<AppConfig>);
    this.components = {};
    _merge(this, cloneDeep(app));
  }

  // middlewareCollection will be overwritten anyways by merging with App
  initializeMiddlewareCollection(): App['middlewareCollection'] {
    return new MiddlewareCollection();
  }

  getDefaultConfig(): AppConfig {
    return {
      placeholder: '',
    };
  }

  mount(): Promise<void> {
    return this.mountPlugins();
  }

  stopMiddlewareExecution(): void {
    this.middlewareCollection.remove(...this.middlewareCollection.names);
  }
}
