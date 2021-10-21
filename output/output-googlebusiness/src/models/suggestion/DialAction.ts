import { IsPhoneNumber } from '@jovotech/output';

export class DialAction {
  @IsPhoneNumber()
  phoneNumber: string;
}
