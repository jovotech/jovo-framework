import { User } from 'jovo-core';
import { AutopilotBot } from './AutopilotBot';

export class AutopilotUser extends User {
  autopilotBot: AutopilotBot;

  constructor(autopilotBot: AutopilotBot) {
    super(autopilotBot);
    this.autopilotBot = autopilotBot;
  }

  getId(): string {
    return this.autopilotBot.$request!.getUserId();
  }
}
