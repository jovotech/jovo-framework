import { User } from 'jovo-core';
import { CorePlatformApp } from './CorePlatformApp';

export class CorePlatformUser extends User {
  constructor(private readonly assistantSkill: CorePlatformApp) {
    super(assistantSkill);
  }

  getAccessToken(): string | undefined {
    return this.assistantSkill.$request!.getAccessToken();
  }

  getId(): string | undefined {
    return this.assistantSkill.$request!.getUserId();
  }
}
