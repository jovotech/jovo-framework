import { Equals, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from '@jovotech/output';
import { BUTTON_TITLE_MAX_LENGTH } from '../../constants';
import { ButtonBase, ButtonType } from './Button';

export class CallButton extends ButtonBase<ButtonType.Call | 'phone_number'> {
  @Equals(ButtonType.Call)
  type!: ButtonType.Call | 'phone_number';

  @IsString()
  @IsNotEmpty()
  @MaxLength(BUTTON_TITLE_MAX_LENGTH)
  title!: string;

  @IsPhoneNumber()
  payload!: string;
}
