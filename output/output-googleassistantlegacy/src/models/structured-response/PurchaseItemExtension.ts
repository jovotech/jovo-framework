import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { USER_STATUS_LABEL_MAX_LENGTH } from '../../constants';
import { ItemOption } from './ItemOption';
import { MerchantUnitMeasure } from './MerchantUnitMeasure';
import { ProductDetails } from './ProductDetails';
import { PurchaseFulfillmentInfo } from './PurchaseFulfillmentInfo';
import { PurchaseStatus, PurchaseType } from './PurchaseOrderExtension';
import { PurchaseReturnsInfo } from './PurchaseReturnsInfo';

export class PurchaseItemExtension {
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_STATUS_LABEL_MAX_LENGTH)
  userVisibleStatusLabel: string;

  @IsEnum(PurchaseType)
  type: PurchaseType;

  @IsInt()
  quantity: number;

  @ValidateNested()
  @Type(() => MerchantUnitMeasure)
  unitMeasure: MerchantUnitMeasure;

  @ValidateNested()
  @Type(() => PurchaseReturnsInfo)
  returnsInfo: PurchaseReturnsInfo;

  @ValidateNested()
  @Type(() => PurchaseFulfillmentInfo)
  fulfillmentInfo: PurchaseFulfillmentInfo;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => ItemOption)
  itemOptions: ItemOption[];

  @IsOptional()
  @IsNotEmptyObject()
  extension?: Record<string | '@type', string | number>;

  @ValidateNested()
  @Type(() => ProductDetails)
  productDetails: ProductDetails;
}
