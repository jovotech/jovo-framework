import { HandleRequest } from './HandleRequest';
import { AnyObject } from './index';
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
  jovo: Jovo,
) => boolean | Promise<boolean>;

export interface DbPluginConfig extends PluginConfig {
  storedElements: {
    $user: {
      enabled: boolean;
    };
    $session: {
      enabled: boolean;
    };
  };
}
