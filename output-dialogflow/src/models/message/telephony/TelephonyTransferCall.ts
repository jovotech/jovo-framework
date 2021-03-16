import { IsPhoneNumber } from '@jovotech/output';

export class TelephonyTransferCall {
  @IsPhoneNumber(null)
  phone_number: string;
}
