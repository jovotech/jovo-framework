import { Jovo, Output } from '@jovotech/framework';
import { CardPermissionScopeLike } from '../models/index'
import { AskForPermissionOutput } from './AskForPermissionOutput';

@Output()
export class AskForRemindersPermissionOutput extends AskForPermissionOutput {
  constructor(jovo: Jovo) {
    super(jovo);
    this.options.permissionScope = CardPermissionScopeLike.ReadWriteReminders;
  }
}
