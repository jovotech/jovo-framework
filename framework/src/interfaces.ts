import { HandleRequest } from './HandleRequest';
import { Jovo } from './Jovo';
import { PersistableSessionData } from './JovoSession';
import { PersistableUserData } from './JovoUser';
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

  id?: string;
  key?: string;
  name?: string;
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

export type JovoConditionFunction = (
  handleRequest: HandleRequest,
  jovo: Jovo,
) => boolean | Promise<boolean>;

type StoredElementType = keyof PersistableUserData | keyof PersistableSessionData;

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
