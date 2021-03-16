import { GenericOutput, JovoResponse } from '@jovotech/output';
import { App, AppConfig } from './App';
import { BaseComponent } from './BaseComponent';
import { InternalSessionProperty, RequestType } from './enums';
import { HandleRequest } from './HandleRequest';
import { Host } from './Host';
import { ComponentConstructor, PickWhere } from './index';
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
  type?: RequestType | string;
  subType?: string;
  optional?: boolean;
}

export interface JovoSession {
  $data: SessionData;
}

export interface DelegateOptions {}

export abstract class Jovo<
  REQ extends JovoRequest = JovoRequest,
  RES extends JovoResponse = JovoResponse
> {
  $asr: AsrData;
  $data: RequestData;
  $entities: EntityMap;
  $nlu: NluData;
  $output: GenericOutput;
  $request: REQ;
  $response?: RES;
  $route?: JovoRoute;
  $session: JovoSession;
  $type: JovoRequestType;

  constructor(
    readonly $app: App,
    readonly $handleRequest: HandleRequest,
    readonly $platform: Platform<REQ, RES>,
  ) {
    this.$asr = {};
    this.$data = {};
    this.$output = {};
    this.$request = this.$platform.createRequestInstance($handleRequest.request);
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

  get $host(): Host {
    return this.$handleRequest.host;
  }

  get $plugins(): HandleRequest['plugins'] {
    return this.$handleRequest.plugins;
  }

  get state(): SessionData[InternalSessionProperty.State] {
    return this.$session.$data[InternalSessionProperty.State];
  }

  redirect<
    COMPONENT extends BaseComponent,
    // eslint-disable-next-line @typescript-eslint/ban-types
    HANDLER extends Exclude<keyof PickWhere<COMPONENT, Function>, keyof BaseComponent>
  >(constructor: ComponentConstructor<COMPONENT>, handlerKey?: HANDLER): this;
  redirect(componentName: string, handlerKey?: string): this;
  redirect(constructorOrName: ComponentConstructor | string, handlerKey?: string): this {
    // TODO implement
    return this;
  }

  delegate<COMPONENT extends BaseComponent>(
    constructor: ComponentConstructor<COMPONENT>,
    options: DelegateOptions,
  ): this;
  delegate(componentName: string, options: DelegateOptions): this;
  delegate(constructorOrName: ComponentConstructor | string, options: DelegateOptions): this {
    // TODO implement
    return this;
  }
}
