import { JovoResponse, OutputTemplate } from '@jovotech/output';
import _get from 'lodash.get';
import { App, AppConfig } from './App';
import { BaseComponent } from './BaseComponent';
import { BaseOutput, OutputConstructor } from './BaseOutput';
import { InternalIntent, InternalSessionProperty, RequestType, RequestTypeLike } from './enums';
import { HandleRequest } from './HandleRequest';
import {
  ComponentConstructor,
  ComponentNotFoundError,
  DeepPartial,
  HandlerNotFoundError,
  PickWhere,
  Server,
  StateStack,
} from './index';
import { AsrData, EntityMap, NluData, RequestData, SessionData } from './interfaces';
import { JovoProxy } from './JovoProxy';
import { JovoRequest } from './JovoRequest';
import { JovoUser } from './JovoUser';
import { RegisteredComponentMetadata } from './metadata/ComponentMetadata';
import { Platform } from './Platform';
import { JovoRoute } from './plugins/RouterPlugin';

export type JovoConstructor<REQUEST extends JovoRequest, RESPONSE extends JovoResponse> = new (
  app: App,
  handleRequest: HandleRequest,
  platform: Platform<REQUEST, RESPONSE>,
  ...args: unknown[]
) => Jovo<REQUEST, RESPONSE>;

export interface JovoRequestType {
  type?: RequestTypeLike;
  subType?: string;
  optional?: boolean;
}

export interface JovoSession {
  [key: string]: unknown;
  $data: SessionData;
  $state?: StateStack;
}

export interface DelegateOptions<EVENTS extends string = string> {
  resolveTo: Record<EVENTS, string>;
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
  $user?: JovoUser<REQUEST, RESPONSE>;

  constructor(
    readonly $app: App,
    readonly $handleRequest: HandleRequest,
    readonly $platform: Platform<REQUEST, RESPONSE>,
  ) {
    this.$asr = {};
    this.$data = {};
    this.$output = [];
    this.$request = this.$platform.createRequestInstance($handleRequest.server.getRequestObject());
    this.$session = this.$request.getSession() || { $data: {} };
    this.$type = this.$request.getRequestType() || { type: RequestType.Unknown, optional: true };
    this.$nlu = this.$request.getNluData() || {};
    this.$entities = this.$nlu.entities || {};
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

  get $state(): SessionData[InternalSessionProperty.State] {
    return this.$session.$state;
  }

  get $subState(): string | undefined {
    if (!this.$state?.length) return;
    return this.$state[this.$state.length - 1]?.subState;
  }

  set $subState(value: string | undefined) {
    if (!this.$state?.length) return;
    this.$state[this.$state.length - 1].subState = value;
    if (this.$route) {
      this.$route.subState = value;
    }
  }

  // TODO determine async/ not async, maybe call platform-specific handler
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<OUTPUT>,
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
      ...stateStack[stateStack.length - 1],
      componentPath: this.$getComponentPath(componentMetadata).join('.'),
      // TODO fully determine whether subState should be removed by $redirect
      subState: undefined,
    };
    await this.$runComponentHandler(componentMetadata, handlerKey);
  }

  protected $getComponentPath(componentMetadata: RegisteredComponentMetadata): string[] {
    const componentName = componentMetadata.options?.name || componentMetadata.target.name;
    const isRootComponent = !!this.$handleRequest.components[componentName];
    return isRootComponent ? [componentName] : [...(this.$route?.path || []), componentName];
  }

  async $delegate<COMPONENT extends BaseComponent>(
    constructor: ComponentConstructor<COMPONENT>,
    options: DelegateOptions,
  ): Promise<void>;
  async $delegate(componentName: string, options: DelegateOptions): Promise<void>;
  async $delegate(
    constructorOrName: ComponentConstructor | string,
    options: DelegateOptions,
  ): Promise<void> {
    const componentMetadata = this.$getComponentMetadataOrFail(constructorOrName);
    const stateStack = this.$state as StateStack;
    stateStack.push({
      ...options,
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
    const componentPath = previousStateStackItem.componentPath.replace(/[.]/g, '.components.');
    const componentMetadata = _get(this.$handleRequest.components, componentPath);
    if (!componentMetadata) {
      // TODO implement
      throw new ComponentNotFoundError('');
    }
    stateStack.pop();
    await this.$runComponentHandler(componentMetadata, resolvedHandlerKey, ...eventArgs);
    return;
  }

  protected $getComponentMetadata<COMPONENT extends BaseComponent = BaseComponent>(
    constructorOrName: ComponentConstructor<COMPONENT> | string,
  ): RegisteredComponentMetadata<COMPONENT> | undefined {
    const componentName =
      typeof constructorOrName === 'string' ? constructorOrName : constructorOrName.name;
    const currentComponentPath = (this.$route?.path || []).join('.components.');
    const currentComponentMetadata = _get(this.$handleRequest.components, currentComponentPath);
    const childComponentMetadata = currentComponentMetadata?.components?.[componentName];
    const rootComponentMetadata = this.$handleRequest.components[componentName];
    return childComponentMetadata || rootComponentMetadata;
  }

  protected $getComponentMetadataOrFail<COMPONENT extends BaseComponent = BaseComponent>(
    constructorOrName: ComponentConstructor<COMPONENT> | string,
  ): RegisteredComponentMetadata<COMPONENT> {
    const componentName =
      typeof constructorOrName === 'string' ? constructorOrName : constructorOrName.name;
    const metadata = this.$getComponentMetadata(componentName);
    if (!metadata) {
      // TODO implement error
      throw new ComponentNotFoundError(componentName);
    }
    return metadata;
  }

  protected async $runComponentHandler<
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
    const jovoReference =
      this.constructor.name === 'Jovo' ? this : ((this as unknown) as JovoProxy).jovo;
    const componentInstance = new (componentMetadata.target as ComponentConstructor)(
      jovoReference,
      componentMetadata.options?.config,
    );
    if (!componentInstance[handlerKey as keyof BaseComponent]) {
      throw new HandlerNotFoundError(handlerKey.toString(), componentName);
    }

    this.$route = {
      path,
      handlerKey: handlerKey.toString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (componentInstance as any)[handlerKey](...callArgs);
  }
}
