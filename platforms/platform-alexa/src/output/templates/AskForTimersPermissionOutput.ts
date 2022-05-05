import { Jovo, Output } from '@jovotech/framework';
import { CardPermissionScopeLike } from '../models';
import { AskForPermissionOutput } from './AskForPermissionOutput';

@Output()
export class AskForTimersPermissionOutput extends AskForPermissionOutput {
  constructor(jovo: Jovo) {
    super(jovo);
    this.options.permissionScope = CardPermissionScopeLike.ReadWriteTimers;
  }
}
