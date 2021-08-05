import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import { App, AppBaseMiddlewares, AppConfig, AppInitConfig } from './App';
import { Extensible } from './Extensible';
import { ComponentTree, ComponentTreeNode, MiddlewareCollection, Platform } from './index';
import { Server } from './Server';

export class HandleRequest extends Extensible<AppConfig, AppBaseMiddlewares> {
  readonly componentTree!: ComponentTree;
  $activeComponentNode?: ComponentTreeNode;
  $platform!: Platform;

  constructor(readonly app: App, readonly server: Server) {
    super(_cloneDeep(app.config) as AppInitConfig);
    _merge(this, _cloneDeep(app));
  }

  get platforms(): ReadonlyArray<Platform> {
    return Object.values(this.plugins).filter((plugin) => plugin instanceof Platform) as Platform[];
  }

  // middlewareCollection will be overwritten anyways by merging with App
  initializeMiddlewareCollection(): App['middlewareCollection'] {
    return new MiddlewareCollection();
  }

  getDefaultConfig(): AppConfig {
    return {
      intentMap: {},
      logging: {},
    };
  }

  mount(): Promise<void> {
    return this.mountPlugins();
  }

  dismount(): Promise<void> {
    return this.dismountPlugins();
  }

  stopMiddlewareExecution(): void {
    this.middlewareCollection.remove(...this.middlewareCollection.names);
  }
}
