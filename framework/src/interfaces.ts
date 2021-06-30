import { OutputTemplate } from '@jovotech/output';
import { HandleRequest } from './HandleRequest';
import { Jovo } from './Jovo';
import { JovoSession } from './JovoSession';
import { PluginConfig } from './Plugin';

export interface Data {
  [key: string]: any;
}

export interface RequestData extends Data {}

export interface ComponentData extends Data {}

export interface SessionData extends Data {}

export interface UserData extends Data {}

export interface Entity {
  [key: string]: unknown | undefined;

  name: string;
  id?: string;
  key?: string;
  value?: unknown;
}

export type EntityMap = Record<string, Entity>;

export interface AsrData {
  [key: string]: unknown;

  text?: string;
}

export interface NluData {
  [key: string]: unknown;

  intent?: {
    name: string;
  };
  entities?: EntityMap;
}

export interface Intent {
  name: string;
  global?: boolean;
}

export type IntentMap = Partial<Record<string, string>>;

export type JovoConditionFunction = (
  handleRequest: HandleRequest,
  jovo: Jovo,
) => boolean | Promise<boolean>;

export type JovoAnyFunction = (jovo: Jovo) => Promise<any>;

export interface JovoHistoryItem {
  output?: OutputTemplate | OutputTemplate[];
  nlu?: NluData;
  state?: JovoSession['$state'];
  entities?: EntityMap;
  asr?: AsrData;
  [key: string]: unknown;
}

export interface StoredElement {
  enabled?: boolean;
  [key: string]: unknown;
}

export interface StoredElementHistory extends StoredElement {
  [key: string]: unknown;
  size?: number;
  asr?: StoredElement | boolean;
  state?: StoredElement | boolean;
  output?: StoredElement | boolean;
  nlu?: StoredElement | boolean;
  request?: StoredElement | boolean;
  response?: StoredElement | boolean;
}

export interface DbPluginConfig extends PluginConfig {
  storedElements?: {
    [key: string]: unknown;
    user?: StoredElement | boolean;
    session?: StoredElement | boolean;
    history?: StoredElementHistory | boolean;
    createdAt?: StoredElement | boolean;
    updateAt?: StoredElement | boolean;
  };
}
