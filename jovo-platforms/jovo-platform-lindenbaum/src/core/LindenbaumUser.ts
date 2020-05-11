import { User } from 'jovo-core';
import { LindenbaumBot } from './LindenbaumBot';

export class LindenbaumUser extends User {
  lindenbaumBot: LindenbaumBot;

  constructor(lindenbaumBot: LindenbaumBot) {
    super(lindenbaumBot);
    this.lindenbaumBot = lindenbaumBot;
  }

  getId(): string {
    return this.lindenbaumBot.$request!.getUserId();
  }
}
