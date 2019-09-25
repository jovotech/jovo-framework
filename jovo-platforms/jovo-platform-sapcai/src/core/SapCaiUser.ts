import { User } from 'jovo-core';
import { SapCaiSkill } from './SapCaiSkill';

export class SapCaiUser extends User {
  caiSkill: SapCaiSkill;

  constructor(caiSkill: SapCaiSkill) {
    super(caiSkill);
    this.caiSkill = caiSkill;
  }

  getAccessToken() {
    return this.caiSkill.$request!.getAccessToken();
  }

  getId(): string {
    return this.caiSkill.$request!.getUserId();
  }
}
