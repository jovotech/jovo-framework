import { GenericOutput } from 'jovo-output';
import { App, AppConfig } from './App';
import { RequestType } from './enums';
import { HandleRequest } from './HandleRequest';
import { Host } from './Host';
import {AsrData, Entity, NluData, RequestData, SessionData} from './interfaces';
import { JovoRequest } from './JovoRequest';
import { JovoResponse } from './JovoResponse';
import { Platform } from './Platform';

export type JovoConstructor<REQ extends JovoRequest, RES extends JovoResponse> = new (
  app: App,
  handleRequest: HandleRequest,
  platform: Platform<REQ, RES>,
  ...args: unknown[]
) => Jovo<REQ, RES>;

export interface JovoRequestType {
  type?: RequestType | string;
  subType?: string;
  optional?: boolean;
}

export interface JovoEntities {
  [key: string]: Entity;
}

export interface JovoSession {
  $data: SessionData;
}

export abstract class Jovo<
  REQ extends JovoRequest = JovoRequest,
  RES extends JovoResponse = JovoResponse
> {
  $asr: AsrData;
  $data: RequestData;
  $entities: JovoEntities;
  $nlu: NluData;
  $output: GenericOutput;
  $request: REQ;
  $response?: RES;
  $session: JovoSession;
  $type: JovoRequestType;

  constructor(
    readonly $app: App,
    readonly $handleRequest: HandleRequest,
    readonly $platform: Platform<REQ, RES>,
  ) {
    this.$asr = {};
    this.$data = {};
    this.$entities = {};
    this.$nlu = {};
    this.$output = {};
    this.$request = this.$platform.createRequestInstance($handleRequest.request);
    this.$session = {
      $data: {},
    };
    this.$type = this.$request.getRequestType() || { type: RequestType.Unknown, optional: true };
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
}
