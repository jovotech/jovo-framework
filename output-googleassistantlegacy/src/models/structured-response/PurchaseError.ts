import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateIf,
  ValidateNested,
} from '@jovotech/output';
import { PriceAttribute } from './PriceAttribute';

export enum ErrorType {
  Unspecified = 'ERROR_TYPE_UNSPECIFIED',
  NotFound = 'NOT_FOUND',
  Invalid = 'INVALID',
  AvailabilityChanged = 'AVAILABILITY_CHANGED',
  PriceChanged = 'PRICE_CHANGED',
  IncorrectPrice = 'INCORRECT_PRICE',
  RequirementsNotMet = 'REQUIREMENTS_NOT_MET',
  TooLate = 'TOO_LATE',
  NoCapacity = 'NO_CAPACITY',
  Ineligible = 'INELIGIBLE',
  OutOfServiceArea = 'OUT_OF_SERVICE_AREA',
  Closed = 'CLOSED',
  PromoNotApplicable = 'PROMO_NOT_APPLICABLE',
  PromoNotRecognized = 'PROMO_NOT_RECOGNIZED',
  PromoExpired = 'PROMO_EXPIRED',
  PromoUserIneligible = 'PROMO_USER_INELIGIBLE',
  PromoOrderIneligible = 'PROMO_ORDER_INELIGIBLE',
  UnavailableSlot = 'UNAVAILABLE_SLOT',
  FailedPrecondition = 'FAILED_PRECONDITION',
  PaymentDeclined = 'PAYMENT_DECLINED',
  MerchantUnreachable = 'MERCHANT_UNREACHABLE',
  AccountLinkingFailed = 'ACCOUNT_LINKING_FAILED',
}

export class PurchaseError {
  @IsEnum(ErrorType)
  type: ErrorType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  entityId?: string;

  @ValidateIf((o) => [ErrorType.PriceChanged, ErrorType.IncorrectPrice].includes(o.type))
  @ValidateNested()
  @Type(() => PriceAttribute)
  updatedPrice?: PriceAttribute;

  @ValidateIf((o) => o.type === ErrorType.AvailabilityChanged)
  @IsInt()
  availableQuantity?: number;
}
