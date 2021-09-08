import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { USER_STATUS_LABEL_MAX_LENGTH } from '../../constants';
import { PurchaseError } from './PurchaseError';
import { PurchaseFulfillmentInfo } from './PurchaseFulfillmentInfo';
import { PurchaseReturnsInfo } from './PurchaseReturnsInfo';

export enum PurchaseStatus {
  Unspecified = 'PURCHASE_STATUS_UNSPECIFIED',
  ReadyForPickup = 'READY_FOR_PICKUP',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  OutOfStock = 'OUT_OF_STOCK',
  InPreparation = 'IN_PREPARATION',
  Created = 'CREATED',
  Confirmed = 'CONFIRMED',
  Rejected = 'REJECTED',
  Returned = 'RETURNED',
  Cancelled = 'CANCELLED',
  ChangeRequested = 'CHANGE_REQUESTED',
}

export enum PurchaseType {
  Unspecified = 'PURCHASE_TYPE_UNSPECIFIED',
  Retail = 'RETAIL',
  Food = 'FOOD',
  Grocery = 'GROCERY',
  MobileRecharge = 'MOBILE_RECHARGE',
}

export enum PurchaseLocationType {
  Unspecified = 'UNSPECIFIED_LOCATION',
  Online = 'ONLINE_PURCHASE',
  InStore = 'INSTORE_PURCHASE',
}

export class PurchaseOrderExtension {
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_STATUS_LABEL_MAX_LENGTH)
  userVisibleStatusLabel: string;

  @IsEnum(PurchaseType)
  type: PurchaseType;

  @ValidateNested()
  @Type(() => PurchaseReturnsInfo)
  returnsInfo: PurchaseReturnsInfo;

  @ValidateNested()
  @Type(() => PurchaseFulfillmentInfo)
  fulfillmentInfo: PurchaseFulfillmentInfo;

  @IsOptional()
  @IsNotEmptyObject()
  extension?: Record<string | '@type', string | number>;

  @IsEnum(PurchaseLocationType)
  purchaseLocationType: PurchaseLocationType;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => PurchaseError)
  errors?: PurchaseError[];
}
