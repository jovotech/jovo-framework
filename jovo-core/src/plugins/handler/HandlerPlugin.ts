import _get from 'lodash.get';
import _merge from 'lodash.merge';
import { DeepPartial, ExtensibleConfig } from '../..';
import { App } from '../../App';
import { HandleRequest } from '../../HandleRequest';
import { Jovo } from '../../Jovo';
import { Plugin } from '../../Plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JovoHandler = (this: Jovo) => Promise<any> | any;

export interface JovoHandlerObject {
  [key: string]: JovoHandlerObject | JovoHandler;
}

export interface HandlerMixin {
  handler: JovoHandlerObject;
  setHandlers<T extends JovoHandlerObject[]>(...handlers: T): this;
}

declare module '../../App' {
  interface App extends HandlerMixin {}
}
declare module '../../HandleRequest' {
  interface HandleRequest extends HandlerMixin {}
}

export interface HandlerPluginConfig extends ExtensibleConfig {}

declare module '../../Extensible' {
  interface ExtensiblePluginConfig {
    HandlerPlugin?: HandlerPluginConfig;
  }
  interface ExtensiblePlugins {
    HandlerPlugin?: HandlerPlugin;
  }
}

export class HandlerPlugin extends Plugin<HandlerPluginConfig> {
  constructor(config?: DeepPartial<HandlerPluginConfig>) {
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
