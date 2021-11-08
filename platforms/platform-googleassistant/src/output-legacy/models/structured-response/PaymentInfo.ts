import { IsEnum, Type, ValidateNested } from '@jovotech/output';
import { PaymentMethodDisplayInfo } from './PaymentMethodDisplayInfo';

export enum PaymentMethodProvenance {
  Unspecified = 'PAYMENT_METHOD_PROVENANCE_UNSPECIFIED',
  Google = 'PAYMENT_METHOD_PROVENANCE_GOOGLE',
  Merchant = 'PAYMENT_METHOD_PROVENANCE_MERCHANT',
}

export class PaymentInfo {
  @ValidateNested()
  @Type(() => PaymentMethodDisplayInfo)
  paymentMethodDisplayInfo!: PaymentMethodDisplayInfo;

  @IsEnum(PaymentMethodProvenance)
  paymentMethodProvenance!: PaymentMethodProvenance;
}
