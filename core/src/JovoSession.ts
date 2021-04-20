import { SessionData } from './interfaces';

export interface StateStackItem {
  [key: string]: unknown;

  componentPath: string;
  subState?: string;
  resolveTo?: Record<string, string>;
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
