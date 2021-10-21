import { Equals, IsUrl } from '@jovotech/output';
import { ButtonBase, ButtonType } from './Button';

export class LogInButton extends ButtonBase<ButtonType.LogIn | 'account_link'> {
  @Equals(ButtonType.LogIn)
  type: ButtonType.LogIn | 'account_link';

  @IsUrl({
    protocols: ['https'],
  })
  url: string;
}
