import { Type } from '@jovotech/output';
import { Button, ButtonType } from '../../models/button/Button';
import { CallButton } from '../../models/button/CallButton';
import { GameButton } from '../../models/button/GameButton';
import { LinkButton } from '../../models/button/LinkButton';
import { LoginButton } from '../../models/button/LoginButton';
import { LogoutButton } from '../../models/button/LogoutButton';
import { PostbackButton } from '../../models/button/PostbackButton';

export function TransformButton(): PropertyDecorator {
  return Type(() => Button, {
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
