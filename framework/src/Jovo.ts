import { JovoResponse, OutputTemplate } from '@jovotech/output';
import _cloneDeep from 'lodash.clonedeep';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { App, AppConfig } from './App';
import { InternalIntent, RequestType, RequestTypeLike } from './enums';
import { HandleRequest } from './HandleRequest';
import {
  BaseComponent,
  BaseOutput,
  ComponentConfig,
  ComponentConstructor,
  ComponentData,
  ComponentNotFoundError,
  DeepPartial,
  HandlerNotFoundError,
  MetadataStorage,
  OutputConstructor,
  PickWhere,
  Server,
  StateStack,
} from './index';
import { AsrData, EntityMap, NluData, RequestData } from './interfaces';
import { JovoRequest } from './JovoRequest';
import { JovoSession } from './JovoSession';
import { JovoUser } from './JovoUser';
import { RegisteredComponentMetadata } from './metadata/ComponentMetadata';
import { Platform } from './Platform';
import { JovoRoute } from './plugins/RouterPlugin';
import { forEachDeep } from './utilities';

export type JovoConstructor<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE> = Jovo<REQUEST, RESPONSE>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, any> = Platform<REQUEST, RESPONSE, JOVO, any>
> = new (app: App, handleRequest: HandleRequest, platform: PLATFORM, ...args: unknown[]) => JOVO;

export interface JovoRequestType {
  type?: RequestTypeLike;
  subType?: string;
  optional?: boolean;
}

export interface JovoComponentInfo<
  CONFIG extends Record<string, unknown> = Record<string, unknown>
> {
  $data: ComponentData;
  $config?: CONFIG;
}

export interface DelegateOptions<
  CONFIG extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
  EVENTS extends string = string
> {
  resolveTo: Record<EVENTS, string | ((this: BaseComponent, ...args: unknown[]) => unknown)>;
  config?: CONFIG;
}

export function registerPlatformSpecificJovoReference<
  KEY extends keyof Jovo,
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>
>(key: KEY, jovoClass: JovoConstructor<REQUEST, RESPONSE, JOVO>): void {
  Object.defineProperty(Jovo.prototype, key, {
    get(): Jovo[KEY] | undefined {
      return this instanceof jovoClass
        ? this
        : this.jovo instanceof jovoClass
        ? this.jovo
        : undefined;
    },
  });
}

export abstract class Jovo<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse
> {
  $asr: AsrData;
  $data: RequestData;
  $entities: EntityMap;
  $nlu: NluData;
  $output: OutputTemplate | OutputTemplate[];
  $request: REQUEST;
  $response?: RESPONSE | RESPONSE[];
  $route?: JovoRoute;
  $session: JovoSession;
  $type: JovoRequestType;
  $user: JovoUser<REQUEST, RESPONSE, this>;

  constructor(
    readonly $app: App,
    readonly $handleRequest: HandleRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly $platform: Platform<REQUEST, RESPONSE, any, any>,
  ) {
    this.$asr = {};
    this.$data = {};
    this.$output = [];
    this.$request = this.$platform.createRequestInstance($handleRequest.server.getRequestObject());
    const session = this.getSession();
    this.$session = session instanceof JovoSession ? session : new JovoSession(session);
    this.$type = this.$request.getRequestType() || { type: RequestType.Unknown, optional: true };
    this.$nlu = this.$request.getNluData() || {};
    this.$entities = this.$nlu.entities || {};
    this.$user = this.$platform.createUserInstance(this);
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

  get $state(): JovoSession['$state'] {
    return this.$session.$state;
  }

  get $subState(): string | undefined {
    if (!this.$state?.length) return;
    return this.$state[this.$state.length - 1]?.$subState;
  }

  set $subState(value: string | undefined) {
    if (!this.$state?.length) return;
    this.$state[this.$state.length - 1].$subState = value;
    if (this.$route) {
      this.$route.subState = value;
    }
  }

  get $component(): JovoComponentInfo {
    const state = this.$state as StateStack;
    const setDataIfNotDefined = () => {
      if (!state[state.length - 1 || 0]?.$data) {
        state[state.length - 1].$data = {};
      }
    };
    return {
      get $data(): ComponentData {
        // Make sure $data exists in latest state.
        setDataIfNotDefined();
        return state[state.length - 1].$data as ComponentData;
      },
      set $data(value: ComponentData) {
        // Make sure $data exists in latest state.
        setDataIfNotDefined();
        state[state.length - 1].$data = value;
      },
      get $config(): Record<string, unknown> | undefined {
        const deserializedStateConfig = _cloneDeep(state?.[state?.length - 1 || 0]?.config);
        if (deserializedStateConfig) {
          // deserialize all found Output-constructors
          forEachDeep(deserializedStateConfig, (value, path) => {
            // TODO: check restriction
            if (
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
      set $config(value: Record<string, unknown> | undefined) {
        state[state.length - 1].config = value;
      },
    };
  }

  // TODO determine async/ not async, maybe call platform-specific handler
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    const outputInstance = new outputConstructor(this, options);
    this.$output = await outputInstance.build();
  }

  async $redirect<
    COMPONENT extends BaseComponent,
    HANDLER extends Exclude<
      // eslint-disable-next-line @typescript-eslint/ban-types
      keyof PickWhere<COMPONENT, Function>,
      keyof BaseComponent
    >
  >(constructor: ComponentConstructor<COMPONENT>, handlerKey?: HANDLER): Promise<void>;
  async $redirect(componentName: string, handlerKey?: string): Promise<void>;
  async $redirect(
    constructorOrName: ComponentConstructor | string,
    handlerKey?: string,
  ): Promise<void> {
    const componentMetadata = this.$getComponentMetadataOrFail(constructorOrName);

    const stateStack = this.$state as StateStack;
    // replace last item in stack
    stateStack[stateStack.length - 1] = {
      componentPath: this.$getComponentPath(componentMetadata).join('.'),
    };
    await this.$runComponentHandler(componentMetadata, handlerKey);
  }

  async $delegate<COMPONENT extends BaseComponent>(
    constructor: ComponentConstructor<COMPONENT>,
    options: DelegateOptions<ComponentConfig<COMPONENT>>,
  ): Promise<void>;
  async $delegate(componentName: string, options: DelegateOptions): Promise<void>;
  async $delegate(
    constructorOrName: ComponentConstructor | string,
    options: DelegateOptions,
  ): Promise<void> {
    const componentMetadata = this.$getComponentMetadataOrFail(constructorOrName);
    const stateStack = this.$state as StateStack;

    const serializableResolveTo: Record<string, string> = {};
    for (const key in options.resolveTo) {
      if (options.resolveTo.hasOwnProperty(key)) {
        const value = options.resolveTo[key];
        serializableResolveTo[key] = typeof value === 'string' ? value : value.name;
      }
    }

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
    stateStack.push({
      resolveTo: serializableResolveTo,
      config: serializableConfig,
      componentPath: this.$getComponentPath(componentMetadata).join('.'),
    });
    await this.$runComponentHandler(componentMetadata);
  }

  // TODO determine whether an error should be thrown if $resolve is called from a context outside a delegation
  async $resolve<ARGS extends any[]>(eventName: string, ...eventArgs: ARGS): Promise<void> {
    const stateStack = this.$state as StateStack;
    const currentStateStackItem = stateStack[stateStack.length - 1];
    const previousStateStackItem = stateStack[stateStack.length - 2];
    if (!currentStateStackItem?.resolveTo || !previousStateStackItem) {
      return;
    }
    const resolvedHandlerKey = currentStateStackItem.resolveTo[eventName];
    const previousComponentPath = previousStateStackItem.componentPath.split('.');
    const previousComponentMetadata = this.$getComponentMetadataOrFail(previousComponentPath);
    stateStack.pop();
    await this.$runComponentHandler(previousComponentMetadata, resolvedHandlerKey, ...eventArgs);
    return;
  }

  $getComponentPath(componentMetadata: RegisteredComponentMetadata): string[] {
    const componentName = componentMetadata.options?.name || componentMetadata.target.name;
    const isRootComponent = !!this.$handleRequest.components[componentName];
    return isRootComponent ? [componentName] : [...(this.$route?.path || []), componentName];
  }

  $getComponentMetadata<COMPONENT extends BaseComponent = BaseComponent>(
    constructorOrNameOrPath: ComponentConstructor<COMPONENT> | string | string[],
  ): RegisteredComponentMetadata<COMPONENT> | undefined {
    if (Array.isArray(constructorOrNameOrPath)) {
      const componentPath = constructorOrNameOrPath.join('.components.');
      return _get(this.$handleRequest.components, componentPath);
    } else {
      const componentName =
        typeof constructorOrNameOrPath === 'string'
          ? constructorOrNameOrPath
          : constructorOrNameOrPath.name;
      const currentComponentMetadata = this.$getComponentMetadata(this.$route?.path || []);
      const rootComponentMetadata = this.$handleRequest.components[componentName];
      const childComponentMetadata = currentComponentMetadata?.components?.[componentName];
      return childComponentMetadata || rootComponentMetadata;
    }
  }

  $getComponentMetadataOrFail<COMPONENT extends BaseComponent = BaseComponent>(
    constructorOrNameOrPath: ComponentConstructor<COMPONENT> | string | string[],
  ): RegisteredComponentMetadata<COMPONENT> {
    const metadata = this.$getComponentMetadata(constructorOrNameOrPath);
    if (!metadata) {
      // TODO implement error
      let path: string[];
      if (Array.isArray(constructorOrNameOrPath)) {
        path = constructorOrNameOrPath;
      } else {
        const componentName =
          typeof constructorOrNameOrPath === 'string'
            ? constructorOrNameOrPath
            : constructorOrNameOrPath.name;
        path = [...(this.$route?.path || []), componentName];
      }
      throw new ComponentNotFoundError(path);
    }
    return metadata;
  }

  async $runComponentHandler<
    COMPONENT extends BaseComponent,
    HANDLER extends Exclude<
      // eslint-disable-next-line @typescript-eslint/ban-types
      keyof PickWhere<COMPONENT, Function>,
      keyof BaseComponent
    >,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ARGS extends any[] = any[]
  >(
    componentMetadata: RegisteredComponentMetadata<COMPONENT>,
    handlerKey: HANDLER | string = InternalIntent.Start,
    ...callArgs: ARGS
  ): Promise<void> {
    const componentName = componentMetadata.options?.name || componentMetadata.target.name;
    const isRootComponent = !!this.$handleRequest.components[componentName];
    const path = isRootComponent ? [componentName] : [...(this.$route?.path || []), componentName];
    const jovoReference = (this as { jovo?: Jovo })?.jovo || this;
    const componentInstance = new (componentMetadata.target as ComponentConstructor)(
      jovoReference as Jovo,
      componentMetadata.options?.config,
    );
    if (!componentInstance[handlerKey as keyof BaseComponent]) {
      throw new HandlerNotFoundError(componentInstance.constructor.name, handlerKey.toString());
    }

    this.$route = {
      path,
      handlerKey: handlerKey.toString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (componentInstance as any)[handlerKey](...callArgs);
  }

  //TODO: needs to be evaluated
  getSession(): JovoSession | undefined {
    return this.$request.getSession();
  }

  //TODO: needs to be evaluated. better this.$session.isNew?
  isNewSession(): boolean {
    return true;
  }

  // abstract isNewSession(): boolean;
}
