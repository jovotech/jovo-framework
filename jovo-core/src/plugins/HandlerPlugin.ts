import _get from 'lodash.get';
import _set from 'lodash.set';
import _merge from 'lodash.merge';
import { App } from '../App';
import { HandleRequest } from '../HandleRequest';
import { BaseComponent, ComponentConstructor, DeepPartial, ExtensibleConfig } from '../index';
import { Jovo } from '../Jovo';
import { Plugin } from '../Plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JovoHandler = (this: Jovo) => Promise<any> | any;

export interface JovoHandlerObject {
  [key: string]: JovoHandlerObject | JovoHandler;
}

export interface HandlerMixin {
  handler: JovoHandlerObject;

  setHandlers<T extends JovoHandlerObject[]>(...handlers: T): this;
}

declare module '../App' {
  interface App extends HandlerMixin {}
}
declare module '../HandleRequest' {
  interface HandleRequest extends HandlerMixin {}
}

export interface HandlerPluginConfig extends ExtensibleConfig {}

declare module '../Extensible' {
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

  private handle = async (handleRequest: HandleRequest, jovo: Jovo) => {
    if (!jovo.$route || !jovo.$route?.path?.length) {
      // TODO error-handling
      return;
    }
    const componentPath = jovo.$route.path.join('.components.');
    const componentMetadata = _get(handleRequest.app.components, componentPath);
    if (!componentMetadata) {
      // TODO error-handling
      return;
    }
    const componentInstancePath = componentPath + '.instance';
    let componentInstance: BaseComponent | undefined = _get<any, string>(
      handleRequest.components,
      componentInstancePath,
    );

    console.log(componentInstance, ' is cached if defined');

    if (!componentInstance) {
      componentInstance = new (componentMetadata.target as ComponentConstructor)(
        jovo,
        componentMetadata.options?.config,
      );
      _set(handleRequest.app.components, componentPath + '.instance', componentInstance);
    }
    if (!(componentInstance as any)[jovo.$route.handlerKey]) {
      // TODO error-handling
      throw new Error(
        `Can not invoke method ${jovo.$route.handlerKey.toString()} of ${
          componentPath[componentPath.length - 1]
        } (${componentInstance.constructor.name})`,
      );
    }
    (componentInstance as any)[jovo.$route.handlerKey]();
    // const route = 'LAUNCH';
    // const fn = _get(handleRequest.handler, route);
    // if (typeof fn === 'function') {
    //   await fn.call(jovo);
    // }
  };

  private mixin(constructor: typeof App | typeof HandleRequest) {
    if (!constructor.prototype.handler) {
      constructor.prototype.handler = {};
    }

    if (!constructor.prototype.setHandlers) {
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
}
