import { IsEnum, IsString, IsNotEmpty } from '@jovotech/output';

export enum PaymentType {
  Unspecified = 'PAYMENT_TYPE_UNSPECIFIED',
  PaymentCard = 'PAYMENT_CARD',
  Bank = 'BANK',
  LoyaltyProgram = 'LOYALTY_PROGRAM',
  Cash = 'CASH',
  GiftCard = 'GIFT_CARD',
  Wallet = 'WALLET',
}

export class PaymentMethodDisplayInfo {
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsString()
  @IsNotEmpty()
  paymentMethodDisplayName: string;
}
