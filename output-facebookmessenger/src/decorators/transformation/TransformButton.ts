import { Type } from '@jovotech/output';
import {
  CallButton,
  GamePlayButton,
  UrlButton,
  LogInButton,
  LogOutButton,
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
        { value: GamePlayButton, name: ButtonType.GamePlay },
        { value: UrlButton, name: ButtonType.Url },
        { value: LogInButton, name: ButtonType.LogIn },
        { value: LogOutButton, name: ButtonType.LogOut },
        { value: PostbackButton, name: ButtonType.Postback },
      ],
    },
  }) as PropertyDecorator;
}
