import { Equals, IsUrl } from '@jovotech/output';
import { ButtonBase, ButtonType } from './Button';

export class LoginButton extends ButtonBase<ButtonType.Login | 'account_link'> {
  @Equals(ButtonType.Login)
  type: ButtonType.Login | 'account_link';

  @IsUrl({
    protocols: ['https'],
  })
  url: string;
}
