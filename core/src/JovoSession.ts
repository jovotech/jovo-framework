import { SessionData, StateStack } from './interfaces';

export class JovoSession {
  [key: string]: unknown;

  $data: SessionData;
  $state?: StateStack;

  constructor(data?: JovoSession) {
    this.$data = data?.$data || {};
    this.$state = data?.$state;
  }
}
