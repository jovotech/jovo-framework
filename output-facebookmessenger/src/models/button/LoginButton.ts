import { Equals, IsUrl } from '@jovotech/output';
import { Button, ButtonType } from './Button';

export class LoginButton extends Button<ButtonType.Login> {
  @Equals(ButtonType.Login)
  type: ButtonType.Login;

  @IsUrl({
    protocols: ['https'],
  })
  url: string;
}
