import { Equals, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from '@jovotech/output';
import { Button, ButtonType } from './Button';

export class CallButton extends Button<ButtonType.Call> {
  @Equals(ButtonType.Call)
  type: ButtonType.Call;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @IsPhoneNumber()
  payload: string;
}
