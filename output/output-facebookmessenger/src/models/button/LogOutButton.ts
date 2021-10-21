import { Equals } from '@jovotech/output';
import { ButtonBase, ButtonType } from './Button';

export class LogOutButton extends ButtonBase<ButtonType.LogOut | 'account_unlink'> {
  @Equals(ButtonType.LogOut)
  type: ButtonType.LogOut | 'account_unlink';
}
