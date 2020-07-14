import { User, Util } from 'jovo-core';
import { BusinessMessagesBot } from './BusinessMessagesBot';

export class BusinessMessagesUser extends User {
  businessMessagesBot: BusinessMessagesBot;
  id: string;

  constructor(businessMessagesBot: BusinessMessagesBot) {
    super(businessMessagesBot);
    this.businessMessagesBot = businessMessagesBot;
    // platform doesn't provide a user ID. To save data in the db, etc. we need an ID tho.
    this.id = Util.randomStr(12);
  }

  getId(): string {
    return this.id;
  }
}
