import { Jovo, Output } from '@jovotech/framework';
import { AskForPermissionOutput } from './AskForPermissionOutput';
import { PermissionScope } from '@jovotech/output-alexa';

@Output()
export class AskForRemindersPermissionOutput extends AskForPermissionOutput {
  constructor(jovo: Jovo) {
    super(jovo);
    this.options.permissionScope = PermissionScope.ReadWriteReminders;
  }
}
