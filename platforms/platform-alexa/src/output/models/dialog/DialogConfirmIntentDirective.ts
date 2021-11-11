import { Equals } from '@jovotech/output';
import { DialogDirective } from './DialogDirective';

export class DialogConfirmIntentDirective extends DialogDirective<'Dialog.ConfirmIntent'> {
  @Equals('Dialog.ConfirmIntent')
  type!: 'Dialog.ConfirmIntent';
}
