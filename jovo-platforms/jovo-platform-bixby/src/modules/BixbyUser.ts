import { User } from 'jovo-core';
import { BixbyCapsule } from '../core/BixbyCapsule';

export class BixbyUser extends User {
  bixbyCapsule: BixbyCapsule;

  constructor(bixbyCapsule: BixbyCapsule) {
    super(bixbyCapsule);
    this.bixbyCapsule = bixbyCapsule;
  }

  getId() {
    return this.bixbyCapsule.$request!.getUserId();
  }
}
