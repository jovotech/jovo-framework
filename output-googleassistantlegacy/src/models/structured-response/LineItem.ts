import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import {
  LINE_ITEM_DESCRIPTION_MAX_LENGTH,
  LINE_ITEM_ID_MAX_LENGTH,
  LINE_ITEM_NAME_MAX_LENGTH,
  LINE_ITEM_NOTE_MAX_LENGTH,
} from '../../constants';
import { IsValidLineItemExtension } from '../../decorators/validation/IsValidLineItemExtension';
import { Image } from '../common/Image';
import { Action } from './Action';
import { Disclosure } from './Disclosure';
import { Merchant } from './Merchant';
import { PriceAttribute } from './PriceAttribute';
import { PurchaseItemExtension } from './PurchaseItemExtension';
import { ReservationItemExtension } from './ReservationItemExtension';
import { UserInfo } from './UserInfo';

export class LineItem {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINE_ITEM_ID_MAX_LENGTH)
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINE_ITEM_NAME_MAX_LENGTH)
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Merchant)
  provider?: Merchant;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => PriceAttribute)
  priceAttributes?: PriceAttribute[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => Action)
  followUpActions?: Action[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => UserInfo)
  recipients?: UserInfo[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINE_ITEM_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(LINE_ITEM_NOTE_MAX_LENGTH, { each: true })
  notes?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Disclosure)
  disclosures?: Disclosure[];

  @IsValidLineItemExtension()
  @Type(() => PurchaseItemExtension)
  purchase?: PurchaseItemExtension;

  @IsValidLineItemExtension()
  @Type(() => ReservationItemExtension)
  reservation?: ReservationItemExtension;
}
