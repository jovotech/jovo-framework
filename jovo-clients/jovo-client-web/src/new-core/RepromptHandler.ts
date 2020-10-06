import { Action } from '..';
import { Client } from '../Client';

// TODO implement
export class RepromptHandler {
  private actions: Action[] = [];
  private attempts = 0;

  constructor(readonly $client: Client) {}
}
