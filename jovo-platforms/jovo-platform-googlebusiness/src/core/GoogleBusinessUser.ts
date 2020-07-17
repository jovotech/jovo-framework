import { User } from 'jovo-core';
import { GoogleBusinessBot } from './GoogleBusinessBot';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export class GoogleBusinessUser extends User {
  googleBusinessBot: GoogleBusinessBot;

  constructor(googleBusinessBot: GoogleBusinessBot) {
    super(googleBusinessBot);
    this.googleBusinessBot = googleBusinessBot;
  }

  getId(): string {
    return (this.googleBusinessBot.$request as GoogleBusinessRequest).getSessionId();
  }
}
