import { Equals } from '@jovotech/output';
import { Button, ButtonType } from './Button';

export class LogoutButton extends Button<ButtonType.Logout> {
  @Equals(ButtonType.Logout)
  type: ButtonType.Logout;
}
