import { Equals, IsNotEmpty, IsString, MaxLength } from '@jovotech/output';
import { BUTTON_TITLE_MAX_LENGTH, PAYLOAD_MAX_LENGTH } from '../../constants';
import { ButtonBase, ButtonType } from './Button';

export class PostbackButton extends ButtonBase<ButtonType.Postback | 'postback'> {
  @Equals(ButtonType.Postback)
  type: ButtonType.Postback | 'postback';

  @IsString()
  @IsNotEmpty()
  @MaxLength(BUTTON_TITLE_MAX_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(PAYLOAD_MAX_LENGTH)
  payload: string;
}
