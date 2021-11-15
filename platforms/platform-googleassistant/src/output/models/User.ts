import { EnumLike } from '@jovotech/framework';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';

export enum AccountLinkingStatus {
  Unspecified = 'ACCOUNT_LINKING_STATUS_UNSPECIFIED',
  NotLinked = 'NOT_LINKED',
  Linked = 'LINKED',
}

export type AccountLinkingStatusLike = EnumLike<AccountLinkingStatus>;

export enum UserVerificationStatus {
  Unspecified = 'USER_VERIFICATION_STATUS_UNSPECIFIED',
  Guest = 'GUEST',
  Verified = 'VERIFIED',
}

export type UserVerificationStatusLike = EnumLike<UserVerificationStatus>;

export class IntentSubscription {
  @IsString()
  @IsNotEmpty()
  intent!: string;

  @IsString()
  @IsNotEmpty()
  contentTitle!: string;
}

export class Engagement {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntentSubscription)
  pushNotificationIntents!: IntentSubscription[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntentSubscription)
  dailyUpdateIntents!: IntentSubscription[];
}

export enum SkuType {
  Unspecified = 'SKU_TYPE_UNSPECIFIED',
  InApp = 'IN_APP',
  Subscription = 'SUBSCRIPTION',
  App = 'APP',
}

export type SkuTypeLike = EnumLike<SkuType>;

export class SignedData {
  @IsObject()
  inAppPurchaseData!: Record<string, unknown>;
  @IsString()
  @IsNotEmpty()
  inAppDataSignature!: string;
}

export class Entitlement {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsEnum(SkuType)
  skuType!: SkuTypeLike;

  @ValidateNested()
  @Type(() => SignedData)
  inAppDetails!: SignedData;
}

export class PackageEntitlements {
  @IsString()
  @IsNotEmpty()
  packageName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Entitlement)
  entitlements!: Entitlement[];
}

export class User {
  @IsString()
  @IsNotEmpty()
  locale!: string;

  @IsOptional()
  @IsObject()
  params?: Record<string, unknown>;

  @IsEnum(AccountLinkingStatus)
  accountLinkingStatus!: AccountLinkingStatusLike;

  @IsEnum(UserVerificationStatus)
  verificationStatus!: UserVerificationStatusLike;

  @IsString()
  @IsNotEmpty()
  lastSeenTime!: string;

  @ValidateNested()
  @Type(() => Engagement)
  engagement!: Engagement;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageEntitlements)
  packageEntitlements!: PackageEntitlements[];
}
