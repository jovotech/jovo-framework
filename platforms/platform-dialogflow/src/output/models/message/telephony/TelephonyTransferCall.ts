import { IsPhoneNumber } from '@jovotech/output';

export class TelephonyTransferCall {
  @IsPhoneNumber()
  phone_number!: string;
}
