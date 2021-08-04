import { Equals, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from '@jovotech/output';
import {BUTTON_TITLE_MAX_LENGTH} from '../../constants';
import { Button, ButtonType } from './Button';

export class CallButton extends Button<ButtonType.Call> {
  @Equals(ButtonType.Call)
  type: ButtonType.Call;

  @IsString()
  @IsNotEmpty()
  @MaxLength(BUTTON_TITLE_MAX_LENGTH)
  title: string;

  @IsPhoneNumber()
  payload: string;
}
