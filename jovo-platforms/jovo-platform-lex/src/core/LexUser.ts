import { User } from 'jovo-core';
import { LexBot } from './LexBot';

export class LexUser extends User {
  lexBot: LexBot;

  constructor(lexBot: LexBot) {
    super(lexBot);
    this.lexBot = lexBot;
  }

  getId(): string {
    return this.lexBot.$request!.getUserId();
  }
}
