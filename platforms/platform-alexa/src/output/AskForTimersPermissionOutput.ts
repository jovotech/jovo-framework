import { Jovo, Output } from '@jovotech/framework';
import { AskForPermissionOutput } from './AskForPermissionOutput';

@Output()
export class AskForTimersPermissionOutput extends AskForPermissionOutput {
  constructor(jovo: Jovo) {
    super(jovo);
    this.options.permissionScope = 'alexa::alerts:timers:skill:readwrite';
  }
}
