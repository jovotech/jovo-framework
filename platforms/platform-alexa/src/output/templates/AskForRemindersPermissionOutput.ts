import { Jovo, Output } from '@jovotech/framework';
import { PermissionScope } from '../models';
import { AskForPermissionOutput } from './AskForPermissionOutput';

@Output()
export class AskForRemindersPermissionOutput extends AskForPermissionOutput {
  constructor(jovo: Jovo) {
    super(jovo);
    this.options.permissionScope = PermissionScope.ReadWriteReminders;
  }
}
