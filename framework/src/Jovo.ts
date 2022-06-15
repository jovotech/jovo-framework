import { DeepPartial, EntityMap, PickWhere, UnknownObject } from '@jovotech/common';
import { JovoResponse, NormalizedOutputTemplate, OutputTemplate } from '@jovotech/output';
import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import _set from 'lodash.set';
import util from 'util';
import { App, AppConfig } from './App';
import { HandleRequest } from './HandleRequest';
import {
  BaseComponent,
  BaseOutput,
  ComponentConfig,
  ComponentConstructor,
  ComponentData,
  DbPluginStoredElementsConfig,
  I18NextAutoPath,
  I18NextResourcesLanguageKeys,
  I18NextResourcesNamespaceKeysOfLanguage,
  I18NextTFunctionOptions,
  I18NextTFunctionResult,
  I18NextTOptions,
  I18NextValueAt,
  JovoInput,
  MetadataStorage,
  OutputConstructor,
  PersistableSessionData,
  PersistableUserData,
  Server,
  StateStackItem,
} from './index';

import { RequestData } from './interfaces';
import { JovoDevice } from './JovoDevice';
import { JovoHistory, JovoHistoryItem, PersistableHistoryData } from './JovoHistory';
import { JovoRequest } from './JovoRequest';
import { JovoSession } from './JovoSession';
import { JovoUser } from './JovoUser';
import { Platform } from './Platform';
import { JovoRoute } from './plugins/RouterPlugin';
import { forEachDeep } from './utilities';

const DELEGATE_MIDDLEWARE = 'event.$delegate';
const RESOLVE_MIDDLEWARE = 'event.$resolve';
const REDIRECT_MIDDLEWARE = 'event.$redirect';
const SEND_MIDDLEWARE = 'event.$send';

export type JovoConstructor<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>,
  USER extends JovoUser<JOVO>,
  DEVICE extends JovoDevice<JOVO>,
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>,
> = new (app: App, handleRequest: HandleRequest, platform: PLATFORM, ...args: unknown[]) => JOVO;

export interface JovoPersistableData {
  user?: PersistableUserData;
  session?: PersistableSessionData;
  history?: PersistableHistoryData;
  createdAt?: string;
  updatedAt?: string;
}

export interface JovoComponentInfo<
  DATA extends ComponentData = ComponentData,
  CONFIG extends UnknownObject = UnknownObject,
> {
  data: DATA;
  config?: CONFIG;
}

export interface DelegateOptions<
  CONFIG extends UnknownObject | undefined = UnknownObject | undefined,
  EVENTS extends string = string,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: Record<EVENTS, string | ((this: BaseComponent, ...args: any[]) => any)>;
  config?: CONFIG;
}

export function registerPlatformSpecificJovoReference<
  KEY extends keyof Jovo,
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>,
  USER extends JovoUser<JOVO>,
  DEVICE extends JovoDevice<JOVO>,
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>,
>(key: KEY, jovoClass: JovoConstructor<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>): void {
  Object.defineProperty(Jovo.prototype, key, {
    get(): Jovo[KEY] | undefined {
      return this instanceof jovoClass ? this : undefined;
    },
  });
}

export abstract class Jovo<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JOVO extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> = any,
  USER extends JovoUser<JOVO> = JovoUser<JOVO>,
  DEVICE extends JovoDevice<JOVO> = JovoDevice<JOVO>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> = any,
> {
  $request: REQUEST;
  $input: JovoInput;
  $output: OutputTemplate[];
  $response?: RESPONSE | RESPONSE[];

  $data: RequestData;
  $device: DEVICE;
  $entities: EntityMap;
  $history: JovoHistory;
  $route?: JovoRoute;
  $session: JovoSession;
  $user: USER;

  $cms: UnknownObject;

  constructor(
    readonly $app: App,
    readonly $handleRequest: HandleRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly $platform: PLATFORM,
  ) {
    this.$request = this.$platform.createRequestInstance($handleRequest.server.getRequestObject());
    this.$input = this.$request.getInput();
    this.$output = [];

    this.$data = {};
    this.$device = this.$platform.createDeviceInstance(this as unknown as JOVO);
    this.$entities = this.getEntityMap();
    this.$history = new JovoHistory();
    this.$session = this.getSession();
    this.$user = this.$platform.createUserInstance(this as unknown as JOVO);

    this.$cms = {};
  }

  get $config(): AppConfig {
    return this.$handleRequest.config;
  }

  get $server(): Server {
    return this.$handleRequest.server;
  }

  get $plugins(): HandleRequest['plugins'] {
    return this.$handleRequest.plugins;
  }

  get $state(): JovoSession['state'] {
    return this.$session.state;
  }

  get $subState(): string | undefined {
    if (!this.$state?.length) return;
    return this.$state[this.$state.length - 1]?.subState;
  }

  set $subState(value: string | undefined) {
    if (!this.$state?.length) return;
    this.$state[this.$state.length - 1].subState = value;
  }

  get $component(): JovoComponentInfo {
    // global components should not have component-data
    if (!this.$state?.length) {
      return {
        data: {},
      };
    }
    const latestStateStackItem = this.$state[this.$state.length - 1];
    return {
      get data(): ComponentData {
        if (!latestStateStackItem.data) {
          latestStateStackItem.data = {};
        }
        return latestStateStackItem.data;
      },
      set data(value: ComponentData) {
        if (!latestStateStackItem.data) {
          latestStateStackItem.data = {};
        }
        latestStateStackItem.data = value;
      },
      get config(): UnknownObject | undefined {
        const deserializedStateConfig = _cloneDeep(latestStateStackItem.config);
        if (deserializedStateConfig) {
          // deserialize all found Output-constructors
          forEachDeep(deserializedStateConfig, (value, path) => {
            // TODO: check restriction
            if (
              value &&
              typeof value === 'object' &&
              value.type === 'output' &&
              value.name &&
              Object.keys(value).length === 2
            ) {
              const outputMetadata = MetadataStorage.getInstance().getOutputMetadataByName(
                value.name,
              );
              if (!outputMetadata) {
                // TODO determine what to do!
                return;
              }
              _set(deserializedStateConfig, path, outputMetadata.target);
            }
          });
        }
        return deserializedStateConfig;
      },
      set config(value: UnknownObject | undefined) {
        latestStateStackItem.config = value;
      },
    };
  }

  $t<
    PATH extends string,
    LANGUAGE extends I18NextResourcesLanguageKeys | string = I18NextResourcesLanguageKeys,
    NAMESPACE extends
      | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>
      | string = I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>,
  >(
    path:
      | I18NextAutoPath<PATH, LANGUAGE, NAMESPACE>
      | PATH
      | Array<I18NextAutoPath<PATH, LANGUAGE, NAMESPACE> | PATH>,
    options?: I18NextTOptions<LANGUAGE, NAMESPACE>,
  ): I18NextValueAt<PATH, LANGUAGE, NAMESPACE>;
  $t<FORCED_RESULT>(path: string | string[], options?: I18NextTFunctionOptions): FORCED_RESULT;
  $t(path: string | string[], options?: I18NextTFunctionOptions): I18NextTFunctionResult {
    if (!options) {
      options = {};
    }

    if (!options.lng) {
      options.lng = this.$request.getLocale();
    }

    if (!options.platform) {
      options.platform = this.$platform.id;
    }

    return this.$app.i18n.t(path, options);
  }

  async $send(outputTemplateOrMessage: OutputTemplate | OutputTemplate[] | string): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructorOrTemplateOrMessage:
      | string
      | OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>
      | OutputTemplate
      | OutputTemplate[],
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    let newOutput: OutputTemplate | OutputTemplate[];
    if (typeof outputConstructorOrTemplateOrMessage === 'function') {
      const outputInstance = new outputConstructorOrTemplateOrMessage(this, options);
      const outputRes = outputInstance.build();
      const output = util.types.isPromise(outputRes) ? await outputRes : outputRes;
      // overwrite reserved properties of the built object i.e. message
      NormalizedOutputTemplate.getKeys().forEach((key) => {
        if (typeof options?.[key] !== 'undefined') {
          if (Array.isArray(output)) {
            output[output.length - 1][key] =
              key === 'platforms'
                ? _merge({}, output[output.length - 1].platforms || {}, options[key])
                : options[key];
          } else {
            output[key] =
              key === 'platforms' ? _merge({}, output[key] || {}, options[key]) : options[key];
          }
        }
      });
      newOutput = output;
    } else if (typeof outputConstructorOrTemplateOrMessage === 'string') {
      newOutput = {
        message: outputConstructorOrTemplateOrMessage,
      };
    } else {
      newOutput = outputConstructorOrTemplateOrMessage;
    }

    // push the new OutputTemplate(s) to $output
    Array.isArray(newOutput) ? this.$output.push(...newOutput) : this.$output.push(newOutput);

    await this.$handleRequest.middlewareCollection.run(SEND_MIDDLEWARE, this, {
      outputConstructorOrTemplateOrMessage,
      options,
    });
  }

  async $redirect<
    COMPONENT extends BaseComponent,
    HANDLER extends Exclude<
      // eslint-disable-next-line @typescript-eslint/ban-types
      keyof PickWhere<COMPONENT, Function>,
      keyof BaseComponent
    >,
  >(constructor: ComponentConstructor<COMPONENT>, handler?: HANDLER): Promise<void>;
  async $redirect(name: string, handler?: string): Promise<void>;
  async $redirect(
    constructorOrName: ComponentConstructor | string,
    handler?: string,
  ): Promise<void> {
    const componentName =
      typeof constructorOrName === 'function' ? constructorOrName.name : constructorOrName;
    // get the node with the given name relative to the currently active component-node
    const componentNode = this.$handleRequest.componentTree.getNodeRelativeToOrFail(
      componentName,
      this.$handleRequest.activeComponentNode?.path,
    );

    // clear the state stack
    this.$session.state = [];

    // add new component to the stack if it's not global
    // @see https://www.jovo.tech/docs/components#global-components
    if (!componentNode.metadata.isGlobal) {
      const stackItem: StateStackItem = {
        component: componentNode.path.join('.'),
      };
      this.$session.state.push(stackItem);
    }

    // update the active component node in handleRequest to keep track of the state
    this.$handleRequest.activeComponentNode = componentNode;

    await this.$handleRequest.middlewareCollection.run(REDIRECT_MIDDLEWARE, this, {
      componentName,
      handler,
    });

    // execute the component's handler
    await componentNode.executeHandler({
      jovo: this.getJovoReference(),
      handler,
    });
  }

  async $delegate<COMPONENT extends BaseComponent>(
    constructor: ComponentConstructor<COMPONENT>,
    options: DelegateOptions<ComponentConfig<COMPONENT>>,
  ): Promise<void>;
  async $delegate(name: string, options: DelegateOptions): Promise<void>;
  async $delegate(
    constructorOrName: ComponentConstructor | string,
    options: DelegateOptions,
  ): Promise<void> {
    const componentName =
      typeof constructorOrName === 'function' ? constructorOrName.name : constructorOrName;
    // get the node with the given name relative to the currently active component-node
    const componentNode = this.$handleRequest.componentTree.getNodeRelativeToOrFail(
      componentName,
      this.$handleRequest.activeComponentNode?.path,
    );

    // if the component that is currently being executed is global
    if (this.$handleRequest.activeComponentNode?.metadata?.isGlobal) {
      // make sure there is a stack
      if (!this.$session.state) {
        this.$session.state = [];
      }
      // add the current component
      this.$session.state.push({
        component: this.$handleRequest.activeComponentNode.path.join('.'),
      });
    }

    // serialize all values in 'resolve'
    const serializableResolve: Record<string, string> = {};
    for (const key in options.resolve) {
      if (options.resolve.hasOwnProperty(key)) {
        const value = options.resolve[key];
        serializableResolve[key] = typeof value === 'string' ? value : value.name;
      }
    }

    // serialize the whole config
    const serializableConfig = _cloneDeep(options.config);
    if (serializableConfig) {
      forEachDeep(serializableConfig, (value, path) => {
        // serialize all passed Output-constructors
        if (value?.prototype instanceof BaseOutput) {
          const outputMetadata = MetadataStorage.getInstance().getOutputMetadata(value);
          if (!outputMetadata) {
            // TODO determine what to do!
            return;
          }
          _set(serializableConfig, path, { type: 'output', name: outputMetadata.name });
        }
      });
    }
    // push the delegating component to the state-stack
    if (!this.$session.state) {
      this.$session.state = [];
    }
    this.$session.state.push({
      resolve: serializableResolve,
      config: serializableConfig,
      component: componentNode.path.join('.'),
    });
    // update the active component node in handleRequest to keep track of the state
    this.$handleRequest.activeComponentNode = componentNode;

    await this.$handleRequest.middlewareCollection.run(DELEGATE_MIDDLEWARE, this, {
      componentName,
      options,
    });

    // execute the component's handler
    await componentNode.executeHandler({
      jovo: this.getJovoReference(),
    });
  }

  // TODO determine whether an error should be thrown if $resolve is called from a context outside a delegation
  async $resolve<ARGS extends unknown[]>(eventName: string, ...eventArgs: ARGS): Promise<void> {
    if (!this.$state) {
      return;
    }
    const currentStateStackItem = this.$state[this.$state.length - 1];
    const previousStateStackItem = this.$state[this.$state.length - 2];
    // make sure the state-stack exists and it long enough
    if (!currentStateStackItem?.resolve || !previousStateStackItem) {
      return;
    }
    const resolvedHandler = currentStateStackItem.resolve[eventName];
    const previousComponentPath = previousStateStackItem.component.split('.');
    // get the previous node
    const previousComponentNode =
      this.$handleRequest.componentTree.getNodeAtOrFail(previousComponentPath);

    // if previous component is global, remove another item from the stack to remove the global component
    if (previousComponentNode.metadata.isGlobal) {
      this.$state.pop();
    }
    // remove the latest item from the state-stack
    this.$state.pop();

    // update the active component node in handleRequest to keep track of the state
    this.$handleRequest.activeComponentNode = previousComponentNode;

    await this.$handleRequest.middlewareCollection.run(RESOLVE_MIDDLEWARE, this, {
      resolvedHandler,
      eventName,
      eventArgs,
    });

    // execute the component's handler
    await previousComponentNode.executeHandler({
      jovo: this.getJovoReference(),
      handler: resolvedHandler,
      callArgs: eventArgs,
    });
  }

  getSession(): JovoSession {
    const session = this.$request.getSession();
    return session instanceof JovoSession ? session : new JovoSession(session);
  }

  getEntityMap(): EntityMap {
    return this.$input.entities || this.$input.nlu?.entities || {};
  }

  getPersistableData(): JovoPersistableData {
    return {
      user: this.$user.getPersistableData(),
      session: this.$session.getPersistableData(),
      history: this.$history.getPersistableData(),
      createdAt: new Date(this.$user.createdAt).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  setPersistableData(data: JovoPersistableData, config?: DbPluginStoredElementsConfig): void {
    const isStoredElementEnabled = (key: 'user' | 'session' | 'history') => {
      const value = config?.[key];
      return typeof value === 'object' ? value.enabled !== false : !!value;
    };

    if (isStoredElementEnabled('user')) {
      this.$user.setPersistableData(data.user);
    }
    if (isStoredElementEnabled('session')) {
      this.$session.setPersistableData(data.session, config?.session);
    }
    if (isStoredElementEnabled('history')) {
      this.$history.setPersistableData(data.history);
    }
    this.$user.createdAt = new Date(data?.createdAt || new Date());
    this.$user.updatedAt = new Date(data?.updatedAt || new Date());
  }

  getCurrentHistoryItem(): JovoHistoryItem {
    return {
      request: this.$request,
      input: this.$input,

      state: this.$state,
      entities: this.$entities,

      output: this.$output,
      response: this.$response,
    };
  }

  protected getJovoReference(): Jovo {
    return (this as { jovo?: Jovo })?.jovo || (this as unknown as Jovo);
  }
}
