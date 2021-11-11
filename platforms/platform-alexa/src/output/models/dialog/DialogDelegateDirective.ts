import { Equals } from '@jovotech/output';
import { DialogDirective } from './DialogDirective';

export class DialogDelegateDirective extends DialogDirective<'Dialog.Delegate'> {
  @Equals('Dialog.Delegate')
  type!: 'Dialog.Delegate';
}
