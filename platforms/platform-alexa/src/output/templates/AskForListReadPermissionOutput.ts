import { Jovo, Output, DeepPartial } from '@jovotech/framework';
import { PermissionScope } from '../models';
import { AskForPermissionOutput, AskForPermissionOutputOptions } from './AskForPermissionOutput';

@Output()
export class AskForListReadPermissionOutput extends AskForPermissionOutput {
  constructor(jovo: Jovo, options: DeepPartial<AskForPermissionOutputOptions> | undefined) {
    super(jovo, options);
    this.options.permissionScope = PermissionScope.ReadList;
  }
}
