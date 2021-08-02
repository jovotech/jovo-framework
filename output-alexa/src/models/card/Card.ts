import {
  Card as BaseCard,
  IsOptional,
  EnumLike,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Type,
} from '@jovotech/output';
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

export enum PermissionScope {
  ReadProfileName = 'alexa::profile:name:read',
  ReadProfileGivenName = 'alexa::profile:given_name:read',
  ReadProfileEmail = 'alexa::profile:email:read',
  ReadProfileMobileNumber = 'alexa::profile:mobile_number:read',
  ReadWriteReminders = 'alexa::alerts:reminders:skill:readwrite',
  ReadWriteTimers = 'alexa::alerts:timers:skill:readwrite',
  ReadList = 'read::alexa:household:list',
  WriteList = 'write::alexa:household:list',
  ReadAddressAll = 'read::alexa:device:all:address',
  ReadAddressCountryAndPostalCode = 'read::alexa:device:all:address:country_and_postal_code',
  ReadGeolocation = 'alexa::devices:all:geolocation:read',
}

export type PermissionScopeLike = EnumLike<PermissionScope> | string;

export class Card<TYPE extends CardTypeLike = CardTypeLike> {
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
