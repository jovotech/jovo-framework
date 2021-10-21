import { IsValidPaymentResultString } from '../../decorators/validation/IsValidPaymentResultString';

export class PaymentResult {
  @IsValidPaymentResultString()
  googlePaymentData?: string;

  @IsValidPaymentResultString()
  merchantPaymentMethodId?: string;
}
