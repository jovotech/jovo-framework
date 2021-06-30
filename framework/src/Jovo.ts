import { JovoResponse, OutputTemplate } from '@jovotech/output';
import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import _set from 'lodash.set';
import { App, AppConfig } from './App';
import { RequestType, RequestTypeLike } from './enums';
import { HandleRequest } from './HandleRequest';
import {
  BaseComponent,
  BaseOutput,
  ComponentConfig,
  ComponentConstructor,
  ComponentData,
  DeepPartial,
  I18NextAutoPath,
  I18NextResourcesLanguageKeys,
  I18NextResourcesNamespaceKeysOfLanguage,
  I18NextTOptions,
  JovoHistoryItem,
  MetadataStorage,
  OutputConstructor,
  PersistableSessionData,
  PersistableUserData,
  PickWhere,
  Server,
  StateStack,
} from './index';
import { AsrData, EntityMap, NluData, RequestData } from './interfaces';
import { JovoRequest } from './JovoRequest';
import { JovoSession } from './JovoSession';
import { JovoUser } from './JovoUser';
import { Platform } from './Platform';
import { JovoRoute } from './plugins/RouterPlugin';
import { forEachDeep } from './utilities';

export type JovoConstructor<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE> = Jovo<REQUEST, RESPONSE>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, any> = Platform<REQUEST, RESPONSE, JOVO, any>,
> = new (app: App, handleRequest: HandleRequest, platform: PLATFORM, ...args: unknown[]) => JOVO;

export interface JovoPersistableData {
  user?: PersistableUserData;
  session?: PersistableSessionData;
  history?: JovoHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JovoRequestType {
  type?: RequestTypeLike;
  subType?: string;
  optional?: boolean;
}

export interface JovoComponentInfo<
  DATA extends ComponentData = ComponentData,
  CONFIG extends Record<string, unknown> = Record<string, unknown>,
> {
  $data: DATA;
  $config?: CONFIG;
}

export interface DelegateOptions<
  CONFIG extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
  EVENTS extends string = string,
> {
  resolve: Record<EVENTS, string | ((this: BaseComponent, ...args: unknown[]) => unknown)>;
  config?: CONFIG;
}

export function registerPlatformSpecificJovoReference<
  KEY extends keyof Jovo,
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
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
  RESPONSE extends JovoResponse = JovoResponse,
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

  $history: JovoHistoryItem[] = [];

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
  ): string {
    if (!options) {
      options = {};
    }
    if (!options.lng) {
      options.lng = this.$request.getLocale() as LANGUAGE;
    }
    return this.$app.i18n.t<PATH, LANGUAGE, NAMESPACE>(path, options);
  }

  async $send(outputTemplate: OutputTemplate | OutputTemplate[]): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructorOrTemplate:
      | OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>
      | OutputTemplate
      | OutputTemplate[],
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    let newOutput: OutputTemplate | OutputTemplate[];
    if (typeof outputConstructorOrTemplate === 'function') {
      const outputInstance = new outputConstructorOrTemplate(this, options);
      const output = await outputInstance.build();
      // overwrite reserved properties of the built object i.e. message
      OutputTemplate.getKeys().forEach((key) => {
        if (options?.[key]) {
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
    } else {
      newOutput = outputConstructorOrTemplate;
    }

    // make $output an array if it is none
    if (!Array.isArray(this.$output)) {
      this.$output = [this.$output];
    }

    // push the new OutputTemplate(s) to $output
    Array.isArray(newOutput) ? this.$output.push(...newOutput) : this.$output.push(newOutput);
  }

  async $redirect<
    COMPONENT extends BaseComponent,
    HANDLER extends Exclude<
      // eslint-disable-next-line @typescript-eslint/ban-types
      keyof PickWhere<COMPONENT, Function>,
      keyof BaseComponent
    >,
  >(constructor: ComponentConstructor<COMPONENT>, handlerKey?: HANDLER): Promise<void>;
  async $redirect(componentName: string, handlerKey?: string): Promise<void>;
  async $redirect(
    constructorOrName: ComponentConstructor | string,
    handlerKey?: string,
  ): Promise<void> {
    const componentName =
      typeof constructorOrName === 'function' ? constructorOrName.name : constructorOrName;
    const componentNode = this.$handleRequest.componentTree.getNodeRelativeToOrFail(
      componentName,
      this.$route?.path || [],
    );

    const stateStack = this.$state as StateStack;
    // replace last item in stack
    stateStack[stateStack.length - 1] = {
      componentPath: componentNode.path.join('.'),
    };

    await componentNode.executeHandler({
      jovo: this.jovoReference,
      handlerKey: handlerKey,
    });
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
    const componentName =
      typeof constructorOrName === 'function' ? constructorOrName.name : constructorOrName;
    const componentNode = this.$handleRequest.componentTree.getNodeRelativeToOrFail(
      componentName,
      this.$route?.path || [],
    );

    const stateStack = this.$state as StateStack;

    const serializableResolve: Record<string, string> = {};
    for (const key in options.resolve) {
      if (options.resolve.hasOwnProperty(key)) {
        const value = options.resolve[key];
        serializableResolve[key] = typeof value === 'string' ? value : value.name;
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
      resolve: serializableResolve,
      config: serializableConfig,
      componentPath: componentNode.path.join('.'),
    });
    await componentNode.executeHandler({
      jovo: this.jovoReference,
    });
  }

  // TODO determine whether an error should be thrown if $resolve is called from a context outside a delegation
  async $resolve<ARGS extends any[]>(eventName: string, ...eventArgs: ARGS): Promise<void> {
    const stateStack = this.$state as StateStack;
    const currentStateStackItem = stateStack[stateStack.length - 1];
    const previousStateStackItem = stateStack[stateStack.length - 2];
    if (!currentStateStackItem?.resolve || !previousStateStackItem) {
      return;
    }
    const resolvedHandlerKey = currentStateStackItem.resolve[eventName];
    const previousComponentPath = previousStateStackItem.componentPath.split('.');
    const previousComponentNode =
      this.$handleRequest.componentTree.getNodeAtOrFail(previousComponentPath);
    stateStack.pop();
    this.$route = {
      path: previousComponentPath,
      handlerKey: resolvedHandlerKey,
      subState: previousStateStackItem.$subState,
    };
    await previousComponentNode.executeHandler({
      jovo: this.jovoReference,
      handlerKey: resolvedHandlerKey,
      updateRoute: false,
      callArgs: eventArgs,
    });
    return;
  }

  //TODO: needs to be evaluated
  getSession(): Partial<JovoSession> | undefined {
    return this.$request.getSession();
  }

  //TODO: needs to be evaluated
  isNewSession(): boolean {
    return this.$session.isNew;
  }


  getPersistableData(): JovoPersistableData {
    return JSON.parse(
      JSON.stringify({
        user: this.$user.getPersistableData(),
        session: this.$session.getPersistableData(),
        history: this.$history,
        createdAt: new Date(this.$user.createdAt),
        updatedAt: new Date(),
      }),
    );
  }

  setPersistableData(data: JovoPersistableData): void {
    this.$user.setPersistableData(data.user);
    this.$session.setPersistableData(data.session);
    this.$history = data?.history || [];
    this.$user.createdAt = new Date(data?.createdAt || new Date());
    this.$user.updatedAt = new Date(data?.updatedAt || new Date());
  }

  getPersistableHistory(): JovoHistoryItem {
    return {
      output: this.$output,
      nlu: this.$nlu,
      state: this.$state,
      entities: this.$entities,
      asr: this.$asr,
      request: this.$request,
      response: this.$response,
    };
    
  private get jovoReference(): Jovo {
    return (this as { jovo?: Jovo })?.jovo || (this as unknown as Jovo);
  }
}
