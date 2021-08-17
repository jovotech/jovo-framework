import { Equals, IsNotEmpty, IsString, MaxLength } from '@jovotech/output';
import { BUTTON_TITLE_MAX_LENGTH, PAYLOAD_MAX_LENGTH } from '../../constants';
import { Button, ButtonType } from './Button';

export class PostbackButton extends Button<ButtonType.Postback> {
  @Equals(ButtonType.Postback)
  type: ButtonType.Postback;

  @IsString()
  @IsNotEmpty()
  @MaxLength(BUTTON_TITLE_MAX_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(PAYLOAD_MAX_LENGTH)
  payload: string;
}
