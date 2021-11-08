import { Type, ValidateNested } from '@jovotech/output';
import { PaymentInfo } from './PaymentInfo';
import { PaymentResult } from './PaymentResult';

export class PaymentData {
  @ValidateNested()
  @Type(() => PaymentResult)
  paymentResult!: PaymentResult;

  @ValidateNested()
  @Type(() => PaymentInfo)
  paymentInfo!: PaymentInfo;
}
