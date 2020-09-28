import { Jovo, User } from 'jovo-core';

export class CorePlatformUser extends User {
  constructor(jovo: Jovo) {
    super(jovo);
  }

  getAccessToken(): string | undefined {
    return this.jovo.$request!.getAccessToken();
  }

  getId(): string | undefined {
    return this.jovo.$request!.getUserId();
  }
}
