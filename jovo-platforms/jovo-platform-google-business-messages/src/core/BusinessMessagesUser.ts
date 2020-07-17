import { User } from 'jovo-core';
import { BusinessMessagesBot } from './BusinessMessagesBot';
import { BusinessMessagesRequest } from './BusinessMessagesRequest';

export class BusinessMessagesUser extends User {
  businessMessagesBot: BusinessMessagesBot;

  constructor(businessMessagesBot: BusinessMessagesBot) {
    super(businessMessagesBot);
    this.businessMessagesBot = businessMessagesBot;
  }

  getId(): string {
    return (this.businessMessagesBot.$request as BusinessMessagesRequest).getSessionId();
  }
}
