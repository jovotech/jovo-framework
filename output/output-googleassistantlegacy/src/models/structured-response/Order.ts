import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { MERCHANT_ORDER_ID_MAX_LENGTH, ORDER_NOTE_MAX_LENGTH } from '../../constants';
import { IsValidOrderExtension } from '../../decorators/validation/IsValidOrderExtension';
import { Image } from '../common/Image';
import { Action } from './Action';
import { Contents } from './Contents';
import { Disclosure } from './Disclosure';
import { Merchant } from './Merchant';
import { PaymentData } from './PaymentData';
import { PriceAttribute } from './PriceAttribute';
import { Promotion } from './Promotion';
import { PurchaseOrderExtension } from './PurchaseOrderExtension';
import { TicketOrderExtension } from './TicketOrderExtension';
import { UserInfo } from './UserInfo';

export class Order {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  googleOrderId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MERCHANT_ORDER_ID_MAX_LENGTH)
  merchantOrderId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userVisibleOrderId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserInfo)
  buyerInfo?: UserInfo;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsDateString()
  createTime: string;

  @IsDateString()
  lastUpdateTime: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Merchant)
  transactionMerchant?: Merchant;

  @ValidateNested()
  @Type(() => Contents)
  contents: Contents;

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
  @ValidateNested()
  @Type(() => PaymentData)
  paymentData?: PaymentData;

  @IsOptional()
  @IsUrl()
  termsOfServiceUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(ORDER_NOTE_MAX_LENGTH)
  note?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => Promotion)
  promotions?: Promotion[];

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => Disclosure)
  disclosures?: Disclosure[];

  @IsValidOrderExtension()
  @Type(() => PurchaseOrderExtension)
  purchase?: PurchaseOrderExtension;

  @IsValidOrderExtension()
  @Type(() => TicketOrderExtension)
  ticket?: TicketOrderExtension;
}
