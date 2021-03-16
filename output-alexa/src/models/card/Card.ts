import { GenericCard, IsEnum, Type } from '@jovotech/output';
import { IsValidCardImage } from '../../decorators/validation/IsValidCardImage';
import { IsValidCardString } from '../../decorators/validation/IsValidCardString';
import { CardImage } from './CardImage';

export enum CardType {
  Simple = 'Simple',
  Standard = 'Standard',
  LinkAccount = 'LinkAccount',
  AskForPermissionsConsent = 'AskForPermissionsConsent',
}

export class Card<TYPE extends CardType = CardType> {
  @IsEnum(CardType)
  type: TYPE;

  @IsValidCardString([CardType.Simple, CardType.Standard, CardType.AskForPermissionsConsent])
  title?: TYPE extends CardType.LinkAccount ? never : string | undefined;

  @IsValidCardString([CardType.Simple, CardType.AskForPermissionsConsent])
  content?: TYPE extends CardType.Standard | CardType.LinkAccount ? never : string | undefined;

  @IsValidCardString([CardType.Standard, CardType.AskForPermissionsConsent])
  text?: TYPE extends CardType.Simple | CardType.LinkAccount ? never : string | undefined;

  @IsValidCardImage([CardType.Standard])
  @Type(() => CardImage)
  image?: TYPE extends CardType.Simple | CardType.LinkAccount | CardType.AskForPermissionsConsent
    ? never
    : CardImage | undefined;

  toGenericCard?(): GenericCard {
    const card: GenericCard = {
      title: (this.title || '') as string,
    };
    if (this.text || this.content) {
      card.subtitle = this.text || this.content;
    }
    if (this.image?.largeImageUrl || this.image?.smallImageUrl) {
      card.imageUrl = this.image.largeImageUrl || this.image.smallImageUrl;
    }
    return card;
  }
}
