import { Type } from '@jovotech/output';
import {
  CallButton,
  GameButton,
  LinkButton,
  LoginButton,
  LogoutButton,
  PostbackButton,
} from '../../models';
// import should not be shortened or decorator has problems with finding the correct enum
import { ButtonBase, ButtonType } from '../../models/button/Button';

export function TransformButton(): PropertyDecorator {
  return Type(() => ButtonBase, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: CallButton, name: ButtonType.Call },
        { value: GameButton, name: ButtonType.Game },
        { value: LinkButton, name: ButtonType.Link },
        { value: LoginButton, name: ButtonType.Login },
        { value: LogoutButton, name: ButtonType.Logout },
        { value: PostbackButton, name: ButtonType.Postback },
      ],
    },
  }) as PropertyDecorator;
}
