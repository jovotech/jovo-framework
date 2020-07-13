import { User } from 'jovo-core';
import { BusinessMessagesBot } from './BusinessMessagesBot';

export class BusinessMessagesUser extends User {
  businessMessagesBot: BusinessMessagesBot;

  constructor(businessMessagesBot: BusinessMessagesBot) {
    super(businessMessagesBot);
    this.businessMessagesBot = businessMessagesBot;
  }

  getId(): string {
    return this.businessMessagesBot.$request!.getUserId();
  }
}
