import { ComponentData, SessionData } from './interfaces';

export interface StateStackItem {
  [key: string]: unknown;

  componentPath: string;
  $subState?: string;
  $data?: ComponentData;

  resolveTo?: Record<string, string>;
  config?: Record<string, unknown>;
}

export type StateStack = StateStackItem[];

export class JovoSession {
  [key: string]: unknown;

  $data: SessionData;
  $state?: StateStack;

  constructor(data?: JovoSession) {
    this.$data = data?.$data || {};
    this.$state = data?.$state;
  }
}
