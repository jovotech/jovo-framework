import { Button, ButtonType } from '../..';

export class LoginButton extends Button {
  constructor(public url: string) {
    super(ButtonType.Login);
  }
}
