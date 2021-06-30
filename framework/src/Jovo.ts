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
  MetadataStorage,
  OutputConstructor,
  PickWhere,
  Server,
  StateStackItem,
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
  }

  get $component(): JovoComponentInfo {
    if (!this.$session.$state) {
      this.$session.$state = [];
    }
    const state = this.$session.$state;
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
    // get the node with the given name relative to the currently active component-node
    const componentNode = this.$handleRequest.componentTree.getNodeRelativeToOrFail(
      componentName,
      this.$handleRequest.$activeComponentNode?.path,
    );

    // update the state-stack if the component is not global
    if (!componentNode.metadata.isGlobal) {
      const stackItem: StateStackItem = {
        componentPath: componentNode.path.join('.'),
      };
      if (!this.$state?.length) {
        // initialize the state-stack if it is empty or does not exist
        this.$session.$state = [stackItem];
      } else {
        // replace last item in stack
        this.$state[this.$state.length - 1] = stackItem;
      }
    }

    // update the active component node in handleRequest to keep track of the state
    this.$handleRequest.$activeComponentNode = componentNode;
    // execute the component's handler
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
    // get the node with the given name relative to the currently active component-node
    const componentNode = this.$handleRequest.componentTree.getNodeRelativeToOrFail(
      componentName,
      this.$handleRequest.$activeComponentNode?.path,
    );

    // make sure the state-stack exists and is not empty, even if it is a global component
    // in order to do that we need to add the path of the currently active component
    if (!this.$session.$state?.length) {
      this.$session.$state = [
        {
          componentPath: (this.$handleRequest.$activeComponentNode?.path || []).join('.'),
        },
      ];
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
    this.$session.$state.push({
      resolve: serializableResolve,
      config: serializableConfig,
      componentPath: componentNode.path.join('.'),
    });
    // update the active component node in handleRequest to keep track of the state
    this.$handleRequest.$activeComponentNode = componentNode;
    // execute the component's handler
    await componentNode.executeHandler({
      jovo: this.jovoReference,
    });
  }

  // TODO determine whether an error should be thrown if $resolve is called from a context outside a delegation
  async $resolve<ARGS extends any[]>(eventName: string, ...eventArgs: ARGS): Promise<void> {
    if (!this.$state) {
      return;
    }
    const currentStateStackItem = this.$state[this.$state.length - 1];
    const previousStateStackItem = this.$state[this.$state.length - 2];
    // make sure the state-stack exists and it long enough
    if (!currentStateStackItem?.resolve || !previousStateStackItem) {
      return;
    }
    const resolvedHandlerKey = currentStateStackItem.resolve[eventName];
    const previousComponentPath = previousStateStackItem.componentPath.split('.');
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
    this.$handleRequest.$activeComponentNode = previousComponentNode;
    // execute the component's handler
    await previousComponentNode.executeHandler({
      jovo: this.jovoReference,
      handlerKey: resolvedHandlerKey,
      callArgs: eventArgs,
    });
  }

  //TODO: needs to be evaluated
  getSession(): Partial<JovoSession> | undefined {
    return this.$request.getSession();
  }

  //TODO: needs to be evaluated
  isNewSession(): boolean {
    return this.$session.isNew;
  }

  private get jovoReference(): Jovo {
    return (this as { jovo?: Jovo })?.jovo || (this as unknown as Jovo);
  }
}
