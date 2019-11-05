import { User } from 'jovo-core';
import { MessengerBot } from './MessengerBot';

export class MessengerBotUser extends User {
  constructor(private readonly messengerBot: MessengerBot) {
    super(messengerBot);
  }

  getId(): string | undefined {
    return this.messengerBot.$request!.getUserId();
  }
}
