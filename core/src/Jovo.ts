import { JovoResponse, OutputTemplate } from '@jovotech/output';
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
} from './index';
import { AsrData, EntityMap, NluData, RequestData, SessionData } from './interfaces';
import { JovoRequest } from './JovoRequest';
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
  $data: SessionData;
}

export interface DelegateOptions {}

export abstract class Jovo<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse
> {
  $asr: AsrData;
  $data: RequestData;
  $entities: EntityMap;
  $nlu: NluData;
  // TODO determine whether it should always be an array and maybe readonly
  $output: OutputTemplate | OutputTemplate[];
  $request: REQUEST;
  $response?: RESPONSE | RESPONSE[];
  $route?: JovoRoute;
  $session: JovoSession;
  $type: JovoRequestType;

  constructor(
    readonly $app: App,
    readonly $handleRequest: HandleRequest,
    readonly $platform: Platform<REQUEST, RESPONSE>,
  ) {
    this.$asr = {};
    this.$data = {};
    this.$output = [];
    this.$request = this.$platform.createRequestInstance($handleRequest.server.getRequestObject());
    this.$session = {
      $data: this.$request.getSessionData() || {},
    };
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

  get state(): SessionData[InternalSessionProperty.State] {
    return this.$session.$data[InternalSessionProperty.State];
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
  >(constructor: ComponentConstructor<COMPONENT>, handlerKey?: HANDLER): Promise<this>;
  async $redirect(componentName: string, handlerKey?: string): Promise<this>;
  async $redirect(
    constructorOrName: ComponentConstructor | string,
    handlerKey?: string,
  ): Promise<this> {
    const key = handlerKey || InternalIntent.Start;

    const componentName =
      typeof constructorOrName === 'string' ? constructorOrName : constructorOrName.name;
    // Max: I think this will cause issues if a component is passed that is not in the root but nested.
    // A component could exist in root and as a child in another component, that has to be taken into account as well.
    const component = this.$handleRequest.components[componentName];
    if (!component) {
      throw new ComponentNotFoundError(`Component ${componentName} not found.`);
    }

    const jovoReference =
      (this as { jovo?: Jovo }).jovo instanceof Jovo ? (this as { jovo?: Jovo }).jovo! : this;

    const componentInstance = new (component.target as ComponentConstructor)(
      jovoReference,
      component.options?.config,
    );
    if (!componentInstance[key as keyof BaseComponent]) {
      throw new HandlerNotFoundError(key.toString(), componentName);
    }
    await componentInstance[key as keyof BaseComponent]();

    // TODO: move somewhere else
    this.$session.$data[InternalSessionProperty.State] = componentInstance.constructor.name;
    return this;
  }

  $delegate<COMPONENT extends BaseComponent>(
    constructor: ComponentConstructor<COMPONENT>,
    options: DelegateOptions,
  ): this;
  $delegate(componentName: string, options: DelegateOptions): this;
  $delegate(constructorOrName: ComponentConstructor | string, options: DelegateOptions): this {
    // TODO implement
    return this;
  }
}
