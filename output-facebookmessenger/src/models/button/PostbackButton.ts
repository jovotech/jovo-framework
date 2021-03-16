import { Equals, IsNotEmpty, IsString, MaxLength } from '@jovotech/output';
import { Button, ButtonType } from './Button';

export class PostbackButton extends Button<ButtonType.Postback> {
  @Equals(ButtonType.Postback)
  type: ButtonType.Postback;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  payload: string;
}
