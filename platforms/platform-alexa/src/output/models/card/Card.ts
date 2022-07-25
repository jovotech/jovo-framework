import { EnumLike } from '@jovotech/framework';
import {
  Card as BaseCard,
  IsOptional,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Type,
} from '@jovotech/output';
import { PermissionScopeLike } from '../../models';
import { IsValidCardImage } from '../../decorators/validation/IsValidCardImage';
import { IsValidCardString } from '../../decorators/validation/IsValidCardString';
import { CardImage } from './CardImage';

export enum CardType {
  Simple = 'Simple',
  Standard = 'Standard',
  LinkAccount = 'LinkAccount',
  AskForPermissionsConsent = 'AskForPermissionsConsent',
}

export type CardTypeLike = EnumLike<CardType>;
export class Card<TYPE extends CardTypeLike = CardTypeLike> {
  @IsEnum(CardType)
  type!: TYPE;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissions?: PermissionScopeLike[];

  toCard?(): BaseCard {
    const card: BaseCard = {
      title: (this.title || '') as string,
    };
    if (this.text || this.content) {
      card.content = this.text || this.content;
    }
    if (this.image?.largeImageUrl || this.image?.smallImageUrl) {
      card.imageUrl = this.image.largeImageUrl || this.image.smallImageUrl;
    }
    return card;
  }
}
