import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Location } from './Location';
import { PickupInfo } from './PickupInfo';
import { PriceAttribute } from './PriceAttribute';
import { Time } from './Time';
import { UserInfo } from './UserInfo';

// TODO check type for 'fulfillmentType' - docs had no concrete enum-values
export class PurchaseFulfillmentInfo {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  fulfillmentType: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Time)
  expectedFulfillmentTime?: Time;

  @IsOptional()
  @ValidateNested()
  @Type(() => Time)
  expectedPreparationTime?: Time;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;

  @IsOptional()
  @IsDateString()
  expireTime?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceAttribute)
  price?: PriceAttribute;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserInfo)
  fulfillmentContact?: UserInfo;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shippingMethodName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  storeCode?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PickupInfo)
  pickupInfo?: PickupInfo;
}
