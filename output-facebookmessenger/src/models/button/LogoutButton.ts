import { Equals } from '@jovotech/output';
import { ButtonBase, ButtonType } from './Button';

export class LogoutButton extends ButtonBase<ButtonType.Logout | 'account_unlink'> {
  @Equals(ButtonType.Logout)
  type: ButtonType.Logout | 'account_unlink';
}
