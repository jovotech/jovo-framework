import { AnyObject, UnknownObject } from './index';
import { Jovo } from './Jovo';
import { PluginConfig } from './Plugin';

export interface Data extends AnyObject {}

export interface RequestData extends Data {}

export interface ComponentData extends Data {}

export interface SessionData extends Data {}

export interface UserData extends Data {}

export interface Entity {
  [key: string]: unknown | undefined;

  name: string;
  id?: string;
  key?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export interface EntityMap {
  [key: string]: Entity | undefined;
}

export interface AsrData extends UnknownObject {
  text?: string;
}

export interface NluData extends UnknownObject {
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

export type JovoConditionFunction = (jovo: Jovo) => boolean | Promise<boolean>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JovoAnyFunction = (jovo: Jovo) => Promise<any>;

export interface StoredElement extends UnknownObject {
  enabled?: boolean;
}

export interface StoredElementHistory extends StoredElement, UnknownObject {
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
