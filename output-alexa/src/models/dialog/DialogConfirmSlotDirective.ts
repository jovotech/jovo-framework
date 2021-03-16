import { Equals, IsNotEmpty, IsString } from '@jovotech/output';
import { DialogDirective } from './DialogDirective';

export class DialogConfirmSlotDirective extends DialogDirective<'Dialog.ConfirmSlot'> {
  @Equals('Dialog.ConfirmSlot')
  type: 'Dialog.ConfirmSlot';

  @IsString()
  @IsNotEmpty()
  slotToConfirm: string;
}
