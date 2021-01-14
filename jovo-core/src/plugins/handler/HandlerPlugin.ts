import _get from 'lodash.get';
import _merge from 'lodash.merge';
import { DeepPartial } from '../..';
import { App } from '../../App';
import { HandleRequest } from '../../HandleRequest';
import { Jovo } from '../../Jovo';
import { Plugin, PluginConfig } from '../../Plugin';
import { HandlerMetadataStorage } from './metadata/HandlerMetadataStorage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JovoHandler = (this: Jovo) => Promise<any> | any;

export interface JovoHandlerObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: JovoHandlerObject | JovoHandler;
}

export interface HandlerMixin {
  handler: JovoHandlerObject;

  setHandlers(...handlers: JovoHandlerObject[]): this;
}

declare module '../../App' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface App extends HandlerMixin {}
}
declare module '../../HandleRequest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HandleRequest extends HandlerMixin {}
}

export class HandlerPlugin extends Plugin {
  constructor(config?: DeepPartial<PluginConfig>) {
    super(config);
    this.mixin(App);
    this.mixin(HandleRequest);
  }

  getDefaultConfig() {
    return {};
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.get('dialog.logic')?.use(this.handle);
    return undefined;
  }

  private async handle(handleRequest: HandleRequest, jovo: Jovo) {
    console.log(HandlerMetadataStorage.getInstance().metadata);
    const route = 'LAUNCH';
    const fn = _get(handleRequest.handler, route);
    if (typeof fn === 'function') {
      await fn.call(jovo);
    }
  }

  private mixin(constructor: typeof App | typeof HandleRequest) {
    constructor.prototype.handler = {};
    Object.defineProperty(constructor.prototype, 'setHandlers', {
      enumerable: false,
      value: function (this: App | HandleRequest, ...handlers: JovoHandlerObject[]) {
        for (let i = 0, len = handlers.length; i < len; i++) {
          this.handler = _merge(this.handlers, handlers[i]);
        }
        return this;
      },
    });
  }
}
