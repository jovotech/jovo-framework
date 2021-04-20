import { InternalSessionProperty } from './enums';
import { HandleRequest } from './HandleRequest';
import { Jovo } from './Jovo';

export interface Data {
  [key: string]: unknown;
}

export interface RequestData extends Data {}

export interface StateStackItem {
  [key: string]: unknown;
  componentPath: string;
  subState?: string;
  resolveTo?: Record<string, string>;
}
export type StateStack = StateStackItem[];

export interface SessionData extends Data {
  // TODO set correct type
  [InternalSessionProperty.State]?: StateStack;
}

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
